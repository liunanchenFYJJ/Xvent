'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
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
function unifyObserver(next, error, complete) {
  if (typeof next === 'object' && next !== null) {
    return next;
  } else {
    const base = {};
    if (typeof next === 'function') base.next = next;
    if (typeof error === 'function') base.error = error;
    if (typeof complete === 'function') base.complete = complete;
    return base;
  }
}
exports.unifyObserver = unifyObserver;
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
function deliver(observers, type, value) {
  for (let observer of observers) {
    switch (type) {
      case 'next':
        typeof observer.next === 'function' && observer.next(value);
      case 'error':
        typeof observer.error === 'function' && observer.error(value);
      case 'complete':
        typeof observer.complete === 'function' && observer.complete();
    }
  }
}
exports.deliver = deliver;
/**
 * 从数组中移除某个元素
 * 该方法会改变数组本身
 *
 * @export
 * @param {any[]} array
 * @param {*} item
 */
function removeFromArray(array, item) {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}
exports.removeFromArray = removeFromArray;
function isFunction(fn) {
  return typeof fn === 'function';
}
exports.isFunction = isFunction;
