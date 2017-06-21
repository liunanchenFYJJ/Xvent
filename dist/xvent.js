'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _stream = require('./stream');

var _stream2 = _interopRequireDefault(_stream);

var _updater = require('./updater');

var _updater2 = _interopRequireDefault(_updater);

var _privateMap = require('./privateMap');

var _privateMap2 = _interopRequireDefault(_privateMap);

var _tool = require('./tool');

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var XventCore = function () {
  function XventCore() {
    (0, _classCallCheck3.default)(this, XventCore);

    _privateMap2.default.init(this, {
      store: new _store2.default(this),
      streamCollector: new _stream2.default()
    });
  }

  (0, _createClass3.default)(XventCore, [{
    key: 'pushIntoStream',
    value: function pushIntoStream(key, value) {
      this.getStreamCollector().next(key, value);
    }
  }, {
    key: 'getStore',
    value: function getStore() {
      return _privateMap2.default.get(this, 'store');
    }
  }, {
    key: 'getStreamCollector',
    value: function getStreamCollector() {
      return _privateMap2.default.get(this, 'streamCollector');
    }
  }, {
    key: 'customize',
    value: function customize(keys, func) {
      keys = (0, _tool.toArray)(keys);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(keys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          this.getStreamCollector().customize(key, func);
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
  }, {
    key: 'on',
    value: function on(keys, actions) {
      var autoAnalyze = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      keys = (0, _tool.toArray)(keys);
      actions = (0, _tool.toArray)(actions);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(keys), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = (0, _getIterator3.default)(actions), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var action = _step3.value;

              this.dispatchToStream(new _updater2.default(key, action, _config.UPDATER_USER_DEFINE, autoAnalyze));
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'bind',
    value: function bind(keys, binders) {
      keys = (0, _tool.toArray)(keys);
      binders = (0, _tool.toArray)(binders);
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = (0, _getIterator3.default)(keys), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var key = _step4.value;
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = (0, _getIterator3.default)(binders), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var binder = _step5.value;

              this.dispatchToStream(XventCore.updater.setter(key, binder));
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }

    /**
     * 订阅转发到stream
     * @param updater{Updater}
     */

  }, {
    key: 'dispatchToStream',
    value: function dispatchToStream(updater) {
      this.getStreamCollector().on(updater);
    }
  }, {
    key: 'kill',
    value: function kill(keys) {
      var actions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var reOn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      keys = (0, _tool.toArray)(keys);
      actions = (0, _tool.toArray)(actions);
      var killAll = !actions.length;
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = (0, _getIterator3.default)(keys), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var key = _step6.value;

          this.getStreamCollector().kill(key, killAll, actions, reOn);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    }

    /**
     * 立即取消当前的订阅，并自动重新订阅
     * @param keys
     * @param actions
     */

  }, {
    key: 'chew',
    value: function chew(keys, actions) {
      this.kill(keys, actions, true);
    }
  }, {
    key: 'unbind',
    value: function unbind(keys) {
      var binders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      keys = (0, _tool.toArray)(keys);
      binders = (0, _tool.toArray)(binders);
    }
  }, {
    key: 'nameSpace',
    value: function nameSpace(name) {
      return this.getStore()[name] = new _store2.default(this, name + ':');
    }
  }]);
  return XventCore;
}();

XventCore.updater = {
  /**
   * 生成订阅配置对象
   * @param key
   * @param binder
   */
  setter: function setter(key, binder) {
    return new _updater2.default(key, function (next) {
      binder[next.key] = next.value;
    }, _config.UPDATER_SETTER, false, binder);
  }
};

function XFactory() {
  var x = void 0;
  return function () {
    if (!x) {
      x = new XventCore();
    }
    return x;
  };
}
exports.default = XFactory();