'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _rxjsEs = require('rxjs-es');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Controller = function () {
  function Controller(xvent) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    (0, _classCallCheck3.default)(this, Controller);

    // this.$x = xvent;
    this.name = name;
    this.$flows = {
      raw: {},
      processed: {}
    };
    this.$listeners = {};
  }

  (0, _createClass3.default)(Controller, [{
    key: 'create',
    value: function create(flowName, func, immediatelyPubWhenSub, initial) {
      var subject = new _rxjsEs.Subject();
      if (immediatelyPubWhenSub) {
        subject = new _rxjsEs.BehaviorSubject(initial);
      }
      this.$flows.raw[flowName] = subject;
      this.$flows.processed[flowName] = func(subject);
      this.$listeners[flowName] = [];
      return this;
    }
  }]);
  return Controller;
}();

exports.default = Controller;