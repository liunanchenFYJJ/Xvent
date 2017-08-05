'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArray = toArray;
exports.generateSubscriber = generateSubscriber;
exports.pub = pub;
exports.sub = sub;
exports.empty = empty;
function toArray(val) {
  return [].concat(val);
}

function generateSubscriber(action) {
  var observer = {};
  if (typeof action === 'function') {
    observer.next = action;
  } else {
    observer = action;
  }
  return observer;
}

function pub(controller, flow, value) {
  controller.$flows[flow].next(value);
}

function sub(controller, flow, observer) {
  var subscription = controller.$flows[flow].subscribe(observer);
  controller.$listeners[flow].push({
    subscription: subscription,
    observer: observer
  });
  return subscription;
}

function empty() {}