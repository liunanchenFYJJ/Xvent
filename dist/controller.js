'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _rxjsEs = require('rxjs-es');

var _tool = require('./tool');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Controller = function () {
  function Controller() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    (0, _classCallCheck3.default)(this, Controller);

    this.name = name;
    this.$flows = {};
    this.$listeners = {};
    this.immediatePub = [];
  }

  (0, _createClass3.default)(Controller, [{
    key: 'define',
    value: function define(flowName, func, behaviorInitial) {
      var subject = new _rxjsEs.Subject();
      if (behaviorInitial) {
        subject = new _rxjsEs.BehaviorSubject(behaviorInitial);
        this.immediatePub.push(flowName);
      }
      var newSubject = subject;
      if (typeof func === 'function') {
        newSubject = func(subject);
      }
      newSubject.subscribe(_tool.empty);
      this.$flows[flowName] = newSubject;
      this.$listeners[flowName] = [];
      return this;
    }
  }]);
  return Controller;
}();

exports.default = Controller;