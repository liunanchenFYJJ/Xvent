/**
 * Created by luwenxu on 2017/6/17.
 */
export default class Updater {
  /**
   * 构造函数。
   * @param nameSpace{string} 订阅源
   * @param key{string} 订阅源
   * @param action{function} 订阅函数
   * @param updaterType{string} 订阅类型
   * @param binder{object} 更新绑定对象
   */
  constructor(nameSpace, key, action, updaterType, binder = null) {
    let subscriber = {};
    if (typeof action === 'function') {
      subscriber.next = action
    } else {
      subscriber = action
    }
    this.nameSpace = nameSpace;
    this.key = key;
    this.action = subscriber;
    this.updaterType = updaterType;
    this.binder = binder;
  }

  static create(key, ...args) {
    return new Updater(key, ...args)
  }
}