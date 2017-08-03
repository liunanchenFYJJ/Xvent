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
    this.$subInfo = {};
  }

  (0, _createClass3.default)(Xvent, [{
    key: 'dispatch',
    value: function dispatch(controllerName, flow, value) {
      this.checkLazySubs(controllerName, flow);
      (0, _tool.pub)(this.$controllers[controllerName], flow, value);
    }
  }, {
    key: 'on',
    value: function on(controllerName, flows, actions) {
      var _this = this;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)((0, _tool.toArray)(flows)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var flow = _step.value;

          var _loop = function _loop(action) {
            var controller = _this.$controllers[controllerName];
            if (flow instanceof RegExp) {
              _this.resolveRegex(controllerName, flow, function () {
                return action;
              });
            } else {
              (0, _tool.sub)(controller, flow, action);
            }
          };

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = (0, _getIterator3.default)((0, _tool.toArray)(actions)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var action = _step2.value;

              _loop(action);
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
      var _this2 = this;

      var _loop2 = function _loop2(flow) {
        var _loop3 = function _loop3(binder) {
          var controller = _this2.$controllers[controllerName];
          if (flow instanceof RegExp) {
            _this2.resolveRegex(controllerName, flow, function (flow) {
              return function (value) {
                binder[flow] = value;
              };
            });
          } else {
            (0, _tool.sub)(controller, flow, function (value) {
              binder[flow] = value;
            });
          }
        };

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = (0, _getIterator3.default)((0, _tool.toArray)(binders)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var binder = _step4.value;

            _loop3(binder);
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

          _loop2(flow);
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
    key: 'controller',
    value: function controller(name) {
      return this.$controllers[name] = new _controller2.default(name);
    }
  }, {
    key: 'controllerAs',
    value: function controllerAs(controller) {
      return new _alias2.default(this, controller);
    }
  }, {
    key: 'resolveRegex',
    value: function resolveRegex(controller, flowRegex, observerFactory) {
      if (!this.$lazySubs[controller]) {
        this.$lazySubs[controller] = [];
      }
      this.$lazySubs[controller].push({
        flowRegex: flowRegex,
        subs: {},
        observerFactory: observerFactory
      });
    }
  }, {
    key: 'checkLazySubs',
    value: function checkLazySubs(controller, flow) {
      var lazySubs = this.$lazySubs[controller];
      if (lazySubs) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = (0, _getIterator3.default)(lazySubs), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var lazy = _step5.value;

            if (!lazy.subs[flow]) {
              if (lazy.flowRegex.test(flow)) {
                lazy.subs[flow] = true;
                (0, _tool.sub)(this.$controllers[controller], flow, lazy.observerFactory(flow));
              }
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
  }]);
  return Xvent;
}();

var x = exports.x = new Xvent();