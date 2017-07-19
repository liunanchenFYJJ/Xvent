"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require("babel-runtime/core-js/reflect/set");

var _set2 = _interopRequireDefault(_set);

var _get = require("babel-runtime/core-js/reflect/get");

var _get2 = _interopRequireDefault(_get);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dispatcher = function Dispatcher(xvent) {
  var _this = this;

  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  (0, _classCallCheck3.default)(this, Dispatcher);

  this.name = name;
  return new Proxy({}, {
    get: function get(target, key, receiver) {
      return (0, _get2.default)(target, key, receiver);
    },
    set: function set(target, key, value, receiver) {
      xvent.pushIntoStream(key, value, _this);
      return (0, _set2.default)(target, key, value, receiver);
    }
  });
};

exports.default = Dispatcher;