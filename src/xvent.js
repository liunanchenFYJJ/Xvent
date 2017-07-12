import Store from './store'
import Stream from './stream'
import Updater from './updater'
import privateMap from './privateMap'
import {toArray} from './tool'
import {
  UPDATER_SETTER, UPDATER_USER_DEFINE
} from './config'
class XventCore {
  constructor() {
    privateMap.init(this, {
      store: new Store(this),
      streamCollector: new Stream(),
    })
  }

  pushIntoStream(key, value, nameSpace='') {
    this.getStreamCollector().next(key, value, nameSpace)
  }

  getStore() {
    return privateMap.get(this, 'store')
  }

  getStreamCollector() {
    return privateMap.get(this, 'streamCollector')
  }

  customize(keys, func) {
    keys = toArray(keys);
    for (let key of keys) {
      this.getStreamCollector().customize(key, func)
    }
  }

  on(keys, actions, autoAnalyze = true) {
    keys = toArray(keys);
    actions = toArray(actions);
    for (let key of keys) {
      for (let action of actions) {
        this.dispatchToStream(new Updater(key, action, UPDATER_USER_DEFINE, autoAnalyze))
      }
    }
  }

  bind(keys, binders) {
    keys = toArray(keys);
    binders = toArray(binders);
    for (let key of keys) {
      for (let binder of binders) {
        this.dispatchToStream(XventCore.updater.setter(key, binder))
      }
    }
  }

  /**
   * 订阅转发到stream
   * @param updater{Updater}
   */
  dispatchToStream(updater) {
    this.getStreamCollector().on(updater)
  }

  kill(keys, actions = [], reOn = false) {
    keys = toArray(keys);
    actions = toArray(actions);
    let killAll = !actions.length;
    for (let key of keys) {
      this.getStreamCollector().kill(key, killAll, actions, reOn)
    }
  }

  /**
   * 立即取消当前的订阅，并自动重新订阅
   * @param keys
   * @param actions
   */
  chew(keys, actions) {
    this.kill(keys, actions, true);
  }

  unbind(keys, binders = [], reOn = false) {
    keys = toArray(keys);
    binders = toArray(binders);
    let unbindAll = !binders.length;
    for(let key of keys) {
      this.getStreamCollector().kill(key, unbindAll, binders, reOn)
    }
  }

  nameSpace(name) {
    return new Store(this, name + ':')
  }
}

XventCore.updater = {
  /**
   * 生成订阅配置对象
   * @param key
   * @param binder
   */
  setter(key, binder){
    return new Updater(
      key,
      next => {
        binder[next.key] = next.value
      },
      UPDATER_SETTER,
      false,
      binder
    )
  }
};

function XFactory() {
  let x;
  return function () {
    if (!x) {
      x = new XventCore()
    }
    return x
  }
}
export default XFactory()