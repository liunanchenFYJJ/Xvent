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

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

var _alias = require('./alias');

var _alias2 = _interopRequireDefault(_alias);

var _tool = require('./tool');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Xvent = function () {
  function Xvent() {
    (0, _classCallCheck3.default)(this, Xvent);

    this.$controllers = {};
    this.$lazySubs = {};
  }

  (0, _createClass3.default)(Xvent, [{
    key: 'dispatch',
    value: function dispatch(controllerName, flow, value) {
      // this.lazySub(controller.name, key);
      (0, _tool.pub)(this.$controllers[controllerName], flow, value);
    }
  }, {
    key: 'on',
    value: function on(controllerName, flows, actions) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)((0, _tool.toArray)(flows)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var flow = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = (0, _getIterator3.default)((0, _tool.toArray)(actions)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var action = _step2.value;

              var controller = this.$controllers[controllerName];
              var observer = (0, _tool.generateSubscriber)(action);
              if (flow === '*') {
                this.resolveAsterisk(controllerName, observer);
              } else {
                (0, _tool.sub)(controller, flow, observer);
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
    key: 'bind',
    value: function bind(controllerName, flows, binders) {
      var _this = this;

      var _loop = function _loop(flow) {
        var _loop2 = function _loop2(binder) {
          var controller = _this.$controllers[controllerName];
          // let observer = generateSubscriber(action);
          if (flow === '*') {
            _this.resolveAsterisk();
          }
          (0, _tool.sub)(controller, flow, function (value) {
            binder[flow] = value;
          });
        };

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = (0, _getIterator3.default)((0, _tool.toArray)(binders)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var binder = _step4.value;

            _loop2(binder);
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
      };

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)((0, _tool.toArray)(flows)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var flow = _step3.value;

          _loop(flow);
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

      return this;
    }
  }, {
    key: 'lazySub',
    value: function lazySub(namespace, key) {
      if (this.$lazySubs[namespace]) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = (0, _getIterator3.default)(this.$lazySubs[namespace]), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var lazy = _step5.value;

            if (!lazy.keys[key]) {
              lazy.keys[key] = true;
              this.getSource(namespace, key).sub(lazy.getUpdater(key), true);
            }
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
    }
  }, {
    key: 'controller',
    value: function controller(name) {
      return this.$controllers[name] = new _controller2.default(this, name);
    }
  }, {
    key: 'controllerAs',
    value: function controllerAs(controller) {
      return new _alias2.default(this, controller);
    }
  }, {
    key: 'resolveAsterisk',
    value: function resolveAsterisk(controller, flow, observer) {
      if (!this.$lazySubs[controller]) {
        this.$lazySubs[controller] = [];
      }
      this.$lazySubs[namespace].push({
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