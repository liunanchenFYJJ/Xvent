'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _weakMap = require('babel-runtime/core-js/weak-map');

var _weakMap2 = _interopRequireDefault(_weakMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var privateMap = new _weakMap2.default();
exports.default = {
  get: function get(obj, key) {
    try {
      if (privateMap.has(obj)) {
        return privateMap.get(obj)[key];
      } else {
        throw new Error('no such private data for ' + obj.toString());
      }
    } catch (err) {
      throw err;
    }
  },
  set: function set(obj, key, value) {
    try {
      if (privateMap.has(obj)) {
        privateMap.get(obj)[key] = value;
      }
    } catch (err) {
      throw err;
    }
  },
  init: function init(obj, initial) {
    privateMap.set(obj, initial);
  }
};