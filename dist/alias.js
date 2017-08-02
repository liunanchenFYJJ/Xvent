"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Alias = function () {
  function Alias(xvent, controller) {
    (0, _classCallCheck3.default)(this, Alias);

    this.xvent = xvent;
    this.$controller = controller;
  }

  (0, _createClass3.default)(Alias, [{
    key: "bind",
    value: function bind() {
      var _xvent;

      for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
        arg[_key] = arguments[_key];
      }

      (_xvent = this.xvent).bind.apply(_xvent, [this.$controller].concat(arg));
      return this;
    }
  }, {
    key: "on",
    value: function on() {
      var _xvent2;

      for (var _len2 = arguments.length, arg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        arg[_key2] = arguments[_key2];
      }

      (_xvent2 = this.xvent).on.apply(_xvent2, [this.$controller].concat(arg));
      return this;
    }
  }, {
    key: "dispatch",
    value: function dispatch() {
      var _xvent3;

      for (var _len3 = arguments.length, arg = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        arg[_key3] = arguments[_key3];
      }

      (_xvent3 = this.xvent).dispatch.apply(_xvent3, [this.$controller].concat(arg));
      return this;
    }
  }]);
  return Alias;
}();

exports.default = Alias;