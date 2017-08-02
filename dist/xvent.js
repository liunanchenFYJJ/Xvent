'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.x = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dispather = require('./dispather');

var _dispather2 = _interopRequireDefault(_dispather);

var _updater = require('./updater');

var _updater2 = _interopRequireDefault(_updater);

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _source = require('./source');

var _source2 = _interopRequireDefault(_source);

var _alias = require('./alias');

var _alias2 = _interopRequireDefault(_alias);

var _config = require('./config');

var _tool = require('./tool');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Xvent = function () {
  function Xvent() {
    (0, _classCallCheck3.default)(this, Xvent);

    this.$controller = _namespace2.default;
    this.lazySubController = {};
  }

  (0, _createClass3.default)(Xvent, [{
    key: 'pushIntoStream',
    value: function pushIntoStream(key, value, dispatcher) {
      this.lazySub(dispatcher.name, key);
      this.getSource(dispatcher.name, key).pub(key, value);
    }
  }, {
    key: 'customize',
    value: function customize() {
      var _reviseArgumentsOfNam = _tool.reviseArgumentsOfNamespace.apply(undefined, arguments),
          namespace = _reviseArgumentsOfNam.$controller,
          keys = _reviseArgumentsOfNam.keys,
          func = _reviseArgumentsOfNam.other;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)((0, _tool.toArray)(keys)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          this.getSource(namespace, key).replace(func);
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

      return this;
    }
  }, {
    key: 'on',
    value: function on() {
      var _this = this;

      var _reviseArgumentsOfNam2 = _tool.reviseArgumentsOfNamespace.apply(undefined, arguments),
          namespace = _reviseArgumentsOfNam2.$controller,
          keys = _reviseArgumentsOfNam2.keys,
          actions = _reviseArgumentsOfNam2.other;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)((0, _tool.toArray)(keys)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          var _loop = function _loop(action) {
            var source = _this.getSource(namespace, key);
            var subscriber = (0, _tool.generateSubscriber)(action);
            if (key === '*') {
              _this.resolveAsterisk(namespace, function (key) {
                return new _updater2.default(key, subscriber, _config.UPDATER_USER_DEFINE);
              });
            } else {
              source.sub(new _updater2.default(key, subscriber, _config.UPDATER_USER_DEFINE), true);
            }
          };

          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = (0, _getIterator3.default)((0, _tool.toArray)(actions)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var action = _step3.value;

              _loop(action);
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

      return this;
    }
  }, {
    key: 'bind',
    value: function bind() {
      var _this2 = this;

      var _reviseArgumentsOfNam3 = _tool.reviseArgumentsOfNamespace.apply(undefined, arguments),
          namespace = _reviseArgumentsOfNam3.$controller,
          keys = _reviseArgumentsOfNam3.keys,
          binders = _reviseArgumentsOfNam3.other;

      var _loop2 = function _loop2(key) {
        var _loop3 = function _loop3(binder) {
          var source = _this2.getSource(namespace, key);
          var subscriber = (0, _tool.generateSubscriber)(function (next) {
            binder[key] = next;
          });
          if (key === '*') {
            _this2.resolveAsterisk(namespace, function (key) {
              return new _updater2.default(key, (0, _tool.generateSubscriber)(function (next) {
                binder[key] = next;
              }), _config.UPDATER_SETTER, binder);
            });
          } else {
            source.sub(new _updater2.default(key, subscriber, _config.UPDATER_SETTER, binder), true);
          }
        };

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = (0, _getIterator3.default)((0, _tool.toArray)(binders)), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var binder = _step5.value;

            _loop3(binder);
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
      };

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = (0, _getIterator3.default)((0, _tool.toArray)(keys)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var key = _step4.value;

          _loop2(key);
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

      return this;
    }
  }, {
    key: 'lazySub',
    value: function lazySub(namespace, key) {
      if (this.lazySubController[namespace]) {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = (0, _getIterator3.default)(this.lazySubController[namespace]), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var lazy = _step6.value;

            if (!lazy.keys[key]) {
              lazy.keys[key] = true;
              this.getSource(namespace, key).sub(lazy.getUpdater(key), true);
            }
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
    }
  }, {
    key: 'createDispatcher',
    value: function createDispatcher(name) {
      return new _dispather2.default(this, name);
    }
  }, {
    key: 'getSource',
    value: function getSource(name, key) {
      var space = void 0;
      if (name === null) {
        space = this.$controller[_config.DEFAULT];
      } else {
        space = this.$controller[name] || (this.$controller[name] = {});
      }
      return space[key] || (space[key] = new _source2.default(key));
    }
  }, {
    key: 'alias',
    value: function alias(namespace) {
      return new _alias2.default(this, namespace);
    }
  }, {
    key: 'resolveAsterisk',
    value: function resolveAsterisk(namespace, updaterFactory) {
      if (!this.lazySubController[namespace]) {
        this.lazySubController[namespace] = [];
      }
      this.lazySubController[namespace].push({
        getUpdater: function getUpdater(key) {
          return updaterFactory(key);
        },
        keys: {}
      });
    }
  }]);
  return Xvent;
}();

var x = exports.x = new Xvent();