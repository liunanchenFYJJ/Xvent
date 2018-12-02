import { PartialObserver } from 'rxjs';
import { Observer_Next, Observer_Error, Observer_Complete } from './store';
/**
 * 统一observer的格式
 *
 * @export
 * @template T
 * @param {(PartialObserver<T> | Observer_Next<T>)} [next]
 * @param {Observer_Error} [error]
 * @param {Observer_Complete} [complete]
 * @returns {PartialObserver<T>}
 */
export declare function unifyObserver<T>(
  next?: PartialObserver<T> | Observer_Next<T>,
  error?: Observer_Error,
  complete?: Observer_Complete
): PartialObserver<T>;
export declare function deliver<T, K extends 'next'>(
  observer: PartialObserver<T>[],
  type: K,
  value: T
): void;
export declare function deliver<T, K extends 'error'>(
  observer: PartialObserver<T>[],
  type: K,
  value: any
): void;
export declare function deliver<T, K extends 'complete'>(
  observer: PartialObserver<T>[],
  type: K
): void;
/**
 * 从数组中移除某个元素
 * 该方法会改变数组本身
 *
 * @export
 * @param {any[]} array
 * @param {*} item
 */
export declare function removeFromArray(array: any[], item: any): any[];
