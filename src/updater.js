export default class Updater {
  /**
   * 构造函数。
   * @param nameSpace{string} 订阅源
   * @param key{string} 订阅源
   * @param action{function} 订阅函数
   * @param updaterType{string} 订阅类型
   * @param binder{object} 更新绑定对象
   */
  constructor(key, action, updaterType, binder = null) {
    this.key = key;
    this.action = action;
    this.updaterType = updaterType;
    this.binder = binder;
  }

  static create(key, ...args) {
    return new Updater(key, ...args)
  }
}