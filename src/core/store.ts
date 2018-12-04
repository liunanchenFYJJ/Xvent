import { of, zip as _zip, PartialObserver, Observable } from 'rxjs';
import { OperatorFunction } from 'rxjs/internal/types';
import { unifyObserver, deliver, removeFromArray } from '../util';

export type ArbitraryFunc = (...args: any[]) => any; // 任意函数

export type DisposeMethod = () => void;

export type IAddReaderMethod<Output> = (
  next?: PartialObserver<Output> | Observer_Next<Output>,
  error?: Observer_Error,
  complete?: Observer_Complete
) => DisposeMethod;

export type ExtendedFunc<Func extends ArbitraryFunc, Output> = Func & {
  addReader: IAddReaderMethod<Output>;
};

/**
 * observable数据读取封装
 *
 * @export
 * @interface IReader
 * @template Output
 */
export interface IDistributor<Output> extends IAddReaderMethod<Output> {
  __isDistributor: boolean;
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
export interface IDistributorProvider<Input, Output>
  extends ExtendedFunc<(input?: Input) => IDistributor<Output>, Output> {
  __isDistributorProvider: boolean;
}

export type OutputFn<T> = T extends IDistributorProvider<
  infer Input,
  infer Output
>
  ? IDistributorProvider<Input, Output>
  : T extends ArbitraryFunc
  ? ExtendedFunc<T, ReturnType<T>>
  : () => T;

export type SnapshotValue<T> = T extends IDistributorProvider<any, infer Output>
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
function isProvider(fn: any): fn is IDistributorProvider<any, any> {
  return fn.__isDistributorProvider;
}

function isReader(fn: any): fn is IDistributor<any> {
  return fn.__isDistributor;
}

/**
 * 生成数据读取包装函数
 *
 * @template Output
 * @param {*} input
 * @param {PartialObserver<Output>[]} outerObservers
 * @param {OperatorFunction<any, any>[]} operators
 * @param {boolean} [inputAsObservable=false]
 * @returns {IDistributor<Output>}
 */
function createDistributor<Output>(
  input: any,
  outerObservers: PartialObserver<Output>[],
  operators: OperatorFunction<any, any>[],
  inputAsObservable: boolean = false
): IDistributor<Output> {
  const observable: Observable<Output> = inputAsObservable
    ? input
    : (<any>of(input).pipe)(...operators);
  const distributor = (
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
  distributor.__isDistributor = true;
  distributor.__observable = observable;
  return distributor;
}

/**
 *生成一个watch方法
 *
 * @template Output
 * @param {PartialObserver<Output>[]} existedReaders
 * @returns {IAddReaderMethod<Output>}
 */
function createAddReader<Output>(
  existedReaders: PartialObserver<Output>[]
): IAddReaderMethod<Output> {
  return (
    next?: PartialObserver<Output> | Observer_Next<Output>,
    error?: Observer_Error,
    complete?: Observer_Complete
  ) => {
    const observer = unifyObserver(next, error, complete);
    existedReaders.push(observer);
    return () => {
      removeFromArray(existedReaders, observer);
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
        value.addReader(next => {
          // 自动更新snapshot
          snapshot[key] = next;
        });
        updator[key] = value;
      } else {
        const observsers: PartialObserver<ReturnType<typeof value>>[] = [];
        const fn = (...args: any[]): ReturnType<typeof value> => {
          // 自动更新snapshot
          snapshot[key] = value(...args);
          // 普通函数只有成功通知
          deliver(observsers, 'next', snapshot[key]);
          return snapshot[key];
        };
        (fn as any).addReader = createAddReader<ReturnType<typeof value>>(
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
 * @returns {IDistributorProvider<Input, Output>}
 */
export function provider<Input, Output>(
  operators: OperatorFunction<any, any>[]
): IDistributorProvider<Input, Output> {
  // 通过watch方法添加的observer视为outerObserver
  const outerObservers: PartialObserver<Output>[] = [];
  const provider: IDistributorProvider<Input, Output> = (input?: Input) => {
    return createDistributor<Output>(input, outerObservers, operators);
  };
  provider.__isDistributorProvider = true;
  provider.addReader = createAddReader(outerObservers);
  return provider;
}

export function connect<Output>(
  source: ExtendedFunc<ArbitraryFunc, Output>,
  target: ArbitraryFunc
): DisposeMethod | undefined {
  if (typeof source.addReader === 'function') {
    return source.addReader((value: Output) => {
      target(value);
    });
  }
}

/**
 * 打包处理reader和普通数据
 *
 * @export
 * @template T
 * @param {any[]} pendings
 * @returns {IDistributor<T>}
 */
export function zip<T>(pendings: any[]): IDistributor<T> {
  const observable = _zip(
    ...pendings.map(v => {
      return isReader(v) ? v.__observable : of(v);
    })
  );
  return createDistributor(observable, [], [], true);
}

/**
 * 生成一个返回输入的函数
 *
 * @export
 * @template T
 * @returns
 */
export function returnSelf<T>() {
  return (value: T): T => {
    return value;
  };
}
