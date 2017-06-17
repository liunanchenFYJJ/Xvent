/**
 * Created by luwenxu on 2017/6/17.
 */
export default class Updater {
  /**
   * 构造函数。
   * @param key{string} 订阅源
   * @param action{function} 订阅函数
   * @param updaterType{string} 订阅类型
   * @param autoAnalyze{boolean} 自动解析
   * @param binder{object} 更新绑定对象
   */
  constructor(key, action, updaterType, autoAnalyze, binder = null) {
    this.key = key;
    this.action = action;
    this.updaterType = updaterType;
    this.autoAnalyze = autoAnalyze;
    this.binder = binder;
  }

  static create(key, ...args) {
    return new Updater(key, ...args)
  }
}