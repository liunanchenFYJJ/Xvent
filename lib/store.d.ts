import { PartialObserver, Observable } from 'rxjs';
import { OperatorFunction } from 'rxjs/internal/types';
export declare type ArbitraryFunc = (...args: any[]) => any;
export declare type DisposeMethod = () => void;
export declare type IAddReaderMethod<Output> = (
  next?: PartialObserver<Output> | Observer_Next<Output>,
  error?: Observer_Error,
  complete?: Observer_Complete
) => DisposeMethod;
export declare type ExtendedFunc<Func extends ArbitraryFunc, Output> = Func & {
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
export declare type OutputFn<T> = T extends IDistributorProvider<
  infer Input,
  infer Output
>
  ? IDistributorProvider<Input, Output>
  : T extends ArbitraryFunc
  ? ExtendedFunc<T, ReturnType<T>>
  : () => T;
export declare type SnapshotValue<T> = T extends IDistributorProvider<
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
 * @returns {IDistributorProvider<Input, Output>}
 */
export declare function provider<Input, Output>(
  operators: OperatorFunction<any, any>[]
): IDistributorProvider<Input, Output>;
export declare function connect<Output>(
  source: ExtendedFunc<ArbitraryFunc, Output>,
  target: ArbitraryFunc
): DisposeMethod | undefined;
/**
 * 打包处理reader和普通数据
 *
 * @export
 * @template T
 * @param {any[]} pendings
 * @returns {IDistributor<T>}
 */
export declare function zip<T>(pendings: any[]): IDistributor<T>;
/**
 * 生成一个返回输入的函数
 *
 * @export
 * @template T
 * @returns
 */
export declare function returnSelf<T>(): (value: T) => T;
