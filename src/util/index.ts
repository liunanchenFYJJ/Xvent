import { PartialObserver } from 'rxjs';
import {
  Observer_Next,
  Observer_Error,
  Observer_Complete,
  ArbitraryFunc
} from '../core/store';

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
export function unifyObserver<T>(
  next?: PartialObserver<T> | Observer_Next<T>,
  error?: Observer_Error,
  complete?: Observer_Complete
): PartialObserver<T> {
  if (typeof next === 'object' && next !== null) {
    return next;
  } else {
    const base: Partial<PartialObserver<T>> = {};
    if (typeof next === 'function') base.next = next;
    if (typeof error === 'function') base.error = error;
    if (typeof complete === 'function') base.complete = complete;
    return base as PartialObserver<T>;
  }
}

export function deliver<T, K extends 'next'>(
  observer: PartialObserver<T>[],
  type: K,
  value: T
): void;
export function deliver<T, K extends 'error'>(
  observer: PartialObserver<T>[],
  type: K,
  value: any
): void;
export function deliver<T, K extends 'complete'>(
  observer: PartialObserver<T>[],
  type: K
): void;
/**
 * 给observer分发数据
 *
 * @export
 * @template T
 * @template K
 * @param {PartialObserver<T>[]} observers
 * @param {K} type
 * @param {K extends 'next' ? T : K extends 'error' ? any : undefined} [value]
 */
export function deliver<T, K extends 'next' | 'error' | 'complete'>(
  observers: PartialObserver<T>[],
  type: K,
  value?: K extends 'next' ? T : K extends 'error' ? any : undefined
) {
  for (let observer of observers) {
    switch (type) {
      case 'next':
        typeof observer.next === 'function' && observer.next(value as T);
      case 'error':
        typeof observer.error === 'function' && observer.error(value);
      case 'complete':
        typeof observer.complete === 'function' && observer.complete();
    }
  }
}

/**
 * 从数组中移除某个元素
 * 该方法会改变数组本身
 *
 * @export
 * @param {any[]} array
 * @param {*} item
 */
export function removeFromArray(array: any[], item: any): any[] {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}

export function isFunction(fn: any): fn is ArbitraryFunc {
  return typeof fn === 'function';
}
