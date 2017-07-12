import Group from './group'
export default class Stream {
  constructor() {
  }

  getGroup(name) {
    return this[name] || (this[name] = new Group(name))
  }

  next(key, value, nameSpace) {
    let group = this.getGroup(nameSpace + key);
    group.pub(key, value, nameSpace);
  }

  customize(key, func) {
    let group = this.getGroup(key);
    group.doCustomize(func)
  }

  on(updater, needTrace = true) {
    let group = this.getGroup(updater.key);
    group.sub(updater, needTrace);
  }

  /**
   * 取消订阅
   * @param key{string} 需要取消的源
   * @param killAll{boolean} 是否取消所有订阅
   * @param unSub{Array} 需要取消的订阅函数。只有当killAll为false的时候才生效
   * @param reOn{boolean} 是否重新订阅
   */
  kill(key, killAll, unSub, reOn = false) {
    let updaters = this.updaters.get(key);
    for (let updater of updaters) {
      let sub;
      if (updater.binder) {
        sub = updater.binder
      } else {
        sub = updater.action
      }
      if (killAll || unSub.indexOf(sub) !== -1) {
        updater.subscription.unsubscribe();
        if (reOn) {
          this.on(updater, false)
        }
      }
    }
  }
}
