import Group from './group'
export default class Stream {
  constructor() {
  }

  getGroup(name) {
    return this[name] || (this[name] = new Group(name))
  }

  next(key, value) {
    let group = this.getGroup(key);
    group.pub(key, value);
  }

  customize(key, func) {
    let group = this.getGroup(key);
    group.doCustomize(func)
  }

  on(updater, needTrace = true) {
    let group = this.getGroup(updater.key);
    group.sub(updater, needTrace);
  }

  kill(key, killAll, unSub, reOn = false) {
    let group = this.getGroup(key);
    group.kill(key, killAll, unSub, reOn);
    // let updaters = this.updaters.get(key);
    // for (let updater of updaters) {
    //   let sub;
    //   if (updater.binder) {
    //     sub = updater.binder
    //   } else {
    //     sub = updater.action
    //   }
    //   if (killAll || unSub.indexOf(sub) !== -1) {
    //     updater.subscription.unsubscribe();
    //     if (reOn) {
    //       this.on(updater, false)
    //     }
    //   }
    // }
  }
}
