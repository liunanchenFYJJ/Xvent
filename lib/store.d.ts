import { PartialObserver, Observable } from 'rxjs';
import { OperatorFunction } from 'rxjs/internal/types';
export declare type ArbitraryFunc = (...args: any[]) => any;
/**
 * Watah方法
 */
export declare type Watch<Output> = (
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
export declare type OutputFn<T> = T extends IReaderProvider<
  infer Input,
  infer Output
>
  ? IReaderProvider<Input, Output>
  : T extends ArbitraryFunc
  ? T & {
      watch: Watch<ReturnType<T>>;
    }
  : () => T;
export declare type SnapshotValue<T> = T extends IReaderProvider<
  any,
  infer Output
>
  ? Output
  : T extends ArbitraryFunc
  ? ReturnType<T>
  : T;
/**
 * 数据updater
 */
export declare type Updator<T> = { [P in keyof T]: OutputFn<T[P]> };
/**
 * 数据快照
 */
export declare type Snapshot<T> = { [P in keyof T]: SnapshotValue<T[P]> };
/**
 * Observer 定义
 */
export declare type Observer_Next<T> = (value: T) => void;
export declare type Observer_Error = (error: any) => void;
export declare type Observer_Complete = () => void;
export declare function create<
  Description extends {
    [prop: string]: any;
  }
>(
  desc: Description
): {
  updator: Updator<Description>;
  snapshot: Snapshot<Description>;
};
/**
 * 生成readerprovider
 *
 * @export
 * @template Input
 * @template Output
 * @param {OperatorFunction<any, any>[]} operators
 * @returns {IReaderProvider<Input, Output>}
 */
export declare function provider<Input, Output>(
  operators: OperatorFunction<any, any>[]
): IReaderProvider<Input, Output>;
/**
 * 打包处理reader和普通数据
 *
 * @export
 * @template T
 * @param {any[]} pendings
 * @returns {IReader<T>}
 */
export declare function zip<T>(pendings: any[]): IReader<T>;
/**
 * 生成一个返回输入的函数
 *
 * @export
 * @template T
 * @returns
 */
export declare function self<T>(): (value: T) => T;
