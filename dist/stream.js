'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _rxjsEs = require('rxjs-es');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Stream = function () {
  function Stream() {
    (0, _classCallCheck3.default)(this, Stream);

    this.updaters = new _map2.default();
  }

  (0, _createClass3.default)(Stream, [{
    key: 'getOrigin',
    value: function getOrigin(key) {
      return this[key] || (this[key] = new _rxjsEs.Subject());
    }
  }, {
    key: 'setOrigin',
    value: function setOrigin(key, origin) {
      return this[key] = origin;
    }
  }, {
    key: 'next',
    value: function next(key, value) {
      var origin = this.getOrigin(key);
      if (value instanceof _promise2.default) {
        _rxjsEs.Observable.fromPromise(value).subscribe({
          next: function next(result) {
            origin.next({ key: key, value: result });
          },
          error: function error() {
            origin.error();
          },
          complete: function complete() {
            origin.complete();
          }
        });
      } else {
        origin.next({ key: key, value: value });
      }
    }
  }, {
    key: 'setTraceOfUpdater',
    value: function setTraceOfUpdater(key, updater) {
      var updaters = this.updaters.get(key);
      if (!updaters) {
        updaters = [];
      }
      updaters = updaters.concat(updater);
      this.updaters.set(key, updaters);
    }
  }, {
    key: 'customize',
    value: function customize(key, func) {
      this.setOrigin(key, func(this.getOrigin(key)));
    }
  }, {
    key: 'on',
    value: function on(updater) {
      var needTrace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var key = updater.key,
          action = updater.action,
          autoAnalyze = updater.autoAnalyze;

      needTrace && this.setTraceOfUpdater(key, updater);
      var origin = this.getOrigin(key);
      updater.subscription = this.getOrigin(key).subscribe(function (next) {
        if (autoAnalyze) {
          action(next.value);
        } else {
          action(next);
        }
      });
      return origin;
    }

    /**
     * 取消订阅
     * @param key{string} 需要取消的源
     * @param killAll{boolean} 是否取消所有订阅
     * @param actions{Array} 需要取消的订阅函数。只有当killAll为false的时候才生效
     * @param reOn{boolean} 是否重新订阅
     */

  }, {
    key: 'kill',
    value: function kill(key, killAll, actions) {
      var reOn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var updaters = this.updaters.get(key);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(updaters), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var updater = _step.value;

          if (killAll || actions.indexOf(updater.action) !== -1) {
            updater.subscription.unsubscribe();
            if (reOn) {
              this.on(updater, false);
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);
  return Stream;
}();

exports.default = Stream;