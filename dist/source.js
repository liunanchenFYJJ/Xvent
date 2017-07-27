'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _rxjsEs = require('rxjs-es');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Source = function () {
  function Source(name) {
    (0, _classCallCheck3.default)(this, Source);

    this.name = name;
    this.origin = new _rxjsEs.Subject();
    this.updaters = [];
    this.customize = false;
  }

  (0, _createClass3.default)(Source, [{
    key: 'sub',
    value: function sub(updater, needTrace) {
      var _this = this;

      needTrace && this.updaters.push(updater);
      var action = updater.action;

      updater.subscription = this.origin.subscribe(function (next) {
        if (_this.customize) {
          action.next(next);
        } else {
          var value = next.value;

          var observable = null;
          if (value instanceof _promise2.default) {
            observable = _rxjsEs.Observable.fromPromise(value);
          } else if (value instanceof _rxjsEs.Observable) {
            observable = value;
          } else {
            observable = _rxjsEs.Observable.of(value);
          }
          observable.subscribe({
            next: function next(value) {
              action.next(value);
            },
            error: function error() {
              action.error && action.error();
            },
            complete: function complete() {
              action.complete && action.complete();
            }
          });
        }
      });
    }
  }, {
    key: 'pub',
    value: function pub(key, value) {
      if (this.customize) {
        this.origin.next(value);
      } else {
        this.origin.next({
          key: key,
          value: value
        });
      }
    }
  }, {
    key: 'replace',
    value: function replace(func) {
      this.customize = true;
      this.origin = func(this.origin);
    }
  }]);
  return Source;
}();

exports.default = Source;