"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by luwenxu on 2017/6/17.
 */
var Updater = function () {
  /**
   * 构造函数。
   * @param key{string} 订阅源
   * @param action{function} 订阅函数
   * @param updaterType{string} 订阅类型
   * @param autoAnalyze{boolean} 自动解析
   * @param binder{object} 更新绑定对象
   */
  function Updater(key, action, updaterType, autoAnalyze) {
    var binder = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    (0, _classCallCheck3.default)(this, Updater);

    this.key = key;
    this.action = action;
    this.updaterType = updaterType;
    this.autoAnalyze = autoAnalyze;
    this.binder = binder;
  }

  (0, _createClass3.default)(Updater, null, [{
    key: "create",
    value: function create(key) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return new (Function.prototype.bind.apply(Updater, [null].concat([key], args)))();
    }
  }]);
  return Updater;
}();

exports.default = Updater;