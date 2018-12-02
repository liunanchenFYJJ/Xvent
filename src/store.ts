import { of, zip as _zip, PartialObserver, Observable } from 'rxjs';
import { OperatorFunction } from 'rxjs/internal/types';
import { unifyObserver, deliver, removeFromArray } from './util';

export type ArbitraryFunc = (...args: any[]) => any; // 任意函数

/**
 * Watah方法
 */
export type Watch<Output> = (
  next?: PartialObserver<Output> | Observer_Next<Output>,
  error?: Observer_Error,
  complete?: Observer_Complete
) => () => void;

/**
 * observable数据读取封装
 *
 * @export
 * @interface IReader
 * @template Output
 */
export interface IReader<Output> {
  (
    next?: PartialObserver<Output> | Observer_Next<Output>,
    error?: Observer_Error,
    complete?: Observer_Complete
  ): () => void;
  __isReader: boolean;
  __observable: Observable<Output>;
}

/**
 * Reader提供方
 *
 * @export
 * @interface IReaderProvider
 * @template Input
 * @template Output
 */
export interface IReaderProvider<Input, Output> {
  (input?: Input): IReader<Output>;
  watch(
    next?: PartialObserver<Output> | Observer_Next<Output>,
    error?: Observer_Error,
    complete?: Observer_Complete
  ): () => void;
  __isReaderProvider: boolean;
}

export type OutputFn<T> = T extends IReaderProvider<infer Input, infer Output>
  ? IReaderProvider<Input, Output>
  : T extends ArbitraryFunc
  ? T & { watch: Watch<ReturnType<T>> }
  : () => T;

export type SnapshotValue<T> = T extends IReaderProvider<any, infer Output>
  ? Output
  : T extends ArbitraryFunc
  ? ReturnType<T>
  : T;

/**
 * 数据updater
 */
export type Updator<T> = { [P in keyof T]: OutputFn<T[P]> };
/**
 * 数据快照
 */
export type Snapshot<T> = { [P in keyof T]: SnapshotValue<T[P]> };

/**
 * Observer 定义
 */
export type Observer_Next<T> = (value: T) => void;
export type Observer_Error = (error: any) => void;
export type Observer_Complete = () => void;

/**
 * 类型判断
 */
function isProvider(fn: any): fn is IReaderProvider<any, any> {
  return fn.__isReaderProvider;
}

function isReader(fn: any): fn is IReader<any> {
  return fn.__isReader;
}

/**
 * 生成数据读取包装函数
 *
 * @template Output
 * @param {*} input
 * @param {PartialObserver<Output>[]} outerObservers
 * @param {OperatorFunction<any, any>[]} operators
 * @param {boolean} [inputAsObservable=false]
 * @returns {IReader<Output>}
 */
function createReader<Output>(
  input: any,
  outerObservers: PartialObserver<Output>[],
  operators: OperatorFunction<any, any>[],
  inputAsObservable: boolean = false
): IReader<Output> {
  const observable: Observable<Output> = inputAsObservable
    ? input
    : (<any>of(input).pipe)(...operators);
  const reader = (
    next?: PartialObserver<Output> | Observer_Next<Output>,
    error?: Observer_Error,
    complete?: Observer_Complete
  ) => {
    const innerObserver = unifyObserver(next, error, complete);
    const allObsersers = ([] as PartialObserver<Output>[])
      .concat(innerObserver)
      .concat(outerObservers); // 固定通知顺序
    const subscription = observable.subscribe(
      value => {
        deliver(allObsersers, 'next', value);
      },
      error => {
        deliver(allObsersers, 'error', error);
      },
      () => {
        deliver(allObsersers, 'complete');
      }
    );
    // 立即返回一个disposer，用来解绑
    return () => {
      subscription.unsubscribe();
    };
  };
  reader.__isReader = true;
  reader.__observable = observable;
  return reader;
}

/**
 *生成一个watch方法
 *
 * @template Output
 * @param {PartialObserver<Output>[]}
 * @returns {Watch<Output>}
 */
function createWatchMethod<Output>(
  observers: PartialObserver<Output>[]
): Watch<Output> {
  return (
    next?: PartialObserver<Output> | Observer_Next<Output>,
    error?: Observer_Error,
    complete?: Observer_Complete
  ) => {
    const observer = unifyObserver(next, error, complete);
    observers.push(observer);
    return () => {
      removeFromArray(observers, observer);
    };
  };
}

export function create<Description extends { [prop: string]: any }>(
  desc: Description
): {
  updator: Updator<Description>;
  snapshot: Snapshot<Description>;
} {
  const updator: Partial<Updator<Description>> = {};
  const snapshot: Partial<Snapshot<Description>> = {};
  Object.keys(desc).forEach(key => {
    const value = desc[key];
    if (typeof value !== 'function') {
      updator[key] = () => value;
      // 固定的snapshot值
      snapshot[key] = value;
    } else {
      if (isProvider(value)) {
        // 自动更新snapshot
        value.watch(next => {
          snapshot[key] = next;
        });
        updator[key] = value;
      } else {
        const observsers: PartialObserver<ReturnType<typeof fn>>[] = [];
        const fn = (...args: any[]): ReturnType<typeof value> => {
          // 自动更新snapshot
          snapshot[key] = value(...args);
          // 普通函数只有成功通知
          deliver(observsers, 'next', snapshot[key]);
          return snapshot[key];
        };
        (fn as any).watch = createWatchMethod<ReturnType<typeof value>>(
          observsers
        );
        updator[key] = fn;
      }
    }
  });
  return {
    updator: updator as Updator<Description>,
    snapshot: snapshot as Snapshot<Description>
  };
}

/**
 * 生成readerprovider
 *
 * @export
 * @template Input
 * @template Output
 * @param {OperatorFunction<any, any>[]} operators
 * @returns {IReaderProvider<Input, Output>}
 */
export function provider<Input, Output>(
  operators: OperatorFunction<any, any>[]
): IReaderProvider<Input, Output> {
  // 通过watch方法添加的observer视为outerObserver
  const outerObservers: PartialObserver<Output>[] = [];
  const provider: IReaderProvider<Input, Output> = (input?: Input) => {
    return createReader<Output>(input, outerObservers, operators);
  };
  provider.__isReaderProvider = true;
  provider.watch = createWatchMethod(outerObservers);
  return provider;
}

/**
 * 打包处理reader和普通数据
 *
 * @export
 * @template T
 * @param {any[]} pendings
 * @returns {IReader<T>}
 */
export function zip<T>(pendings: any[]): IReader<T> {
  const observable = _zip(
    ...pendings.map(v => {
      return isReader(v) ? v.__observable : of(v);
    })
  );
  return createReader(observable, [], [], true);
}

/**
 * 生成一个返回输入的函数
 *
 * @export
 * @template T
 * @returns
 */
export function self<T>() {
  return (value: T): T => {
    return value;
  };
}
