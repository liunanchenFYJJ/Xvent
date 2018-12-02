'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const rxjs_1 = require('rxjs');
const util_1 = require('./util');
/**
 * 类型判断
 */
function isProvider(fn) {
  return fn.__isReaderProvider;
}
function isReader(fn) {
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
function createReader(
  input,
  outerObservers,
  operators,
  inputAsObservable = false
) {
  const observable = inputAsObservable
    ? input
    : rxjs_1.of(input).pipe(...operators);
  const reader = (next, error, complete) => {
    const innerObserver = util_1.unifyObserver(next, error, complete);
    const allObsersers = [].concat(innerObserver).concat(outerObservers); // 固定通知顺序
    const subscription = observable.subscribe(
      value => {
        util_1.deliver(allObsersers, 'next', value);
      },
      error => {
        util_1.deliver(allObsersers, 'error', error);
      },
      () => {
        util_1.deliver(allObsersers, 'complete');
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
function createWatchMethod(observers) {
  return (next, error, complete) => {
    const observer = util_1.unifyObserver(next, error, complete);
    observers.push(observer);
    return () => {
      util_1.removeFromArray(observers, observer);
    };
  };
}
function create(desc) {
  const updator = {};
  const snapshot = {};
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
        const observsers = [];
        const fn = (...args) => {
          // 自动更新snapshot
          snapshot[key] = value(...args);
          // 普通函数只有成功通知
          util_1.deliver(observsers, 'next', snapshot[key]);
          return snapshot[key];
        };
        fn.watch = createWatchMethod(observsers);
        updator[key] = fn;
      }
    }
  });
  return {
    updator: updator,
    snapshot: snapshot
  };
}
exports.create = create;
/**
 * 生成readerprovider
 *
 * @export
 * @template Input
 * @template Output
 * @param {OperatorFunction<any, any>[]} operators
 * @returns {IReaderProvider<Input, Output>}
 */
function provider(operators) {
  // 通过watch方法添加的observer视为outerObserver
  const outerObservers = [];
  const provider = input => {
    return createReader(input, outerObservers, operators);
  };
  provider.__isReaderProvider = true;
  provider.watch = createWatchMethod(outerObservers);
  return provider;
}
exports.provider = provider;
/**
 * 打包处理reader和普通数据
 *
 * @export
 * @template T
 * @param {any[]} pendings
 * @returns {IReader<T>}
 */
function zip(pendings) {
  const observable = rxjs_1.zip(
    ...pendings.map(v => {
      return isReader(v) ? v.__observable : rxjs_1.of(v);
    })
  );
  return createReader(observable, [], [], true);
}
exports.zip = zip;
/**
 * 生成一个返回输入的函数
 *
 * @export
 * @template T
 * @returns
 */
function self() {
  return value => {
    return value;
  };
}
exports.self = self;
