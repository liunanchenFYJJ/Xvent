import Store from './store'
import Stream from './stream'
import Updater from './updater'
import privateMap from './privateMap'
import {toArray} from './tool'
import {
  UPDATER_SETTER, UPDATER_USER_DEFINE
} from './config'
export default class Xvent{
  constructor() {
    privateMap.init(this, {
      store: new Store(this),
      stream: new Stream(),
    })
  }

  pushIntoStream(key, value) {
    this.getStream().next(key, value)
  }

  getStore() {
    return privateMap.get(this, 'store')
  }

  getStream() {
    return privateMap.get(this, 'stream')
  }

  customize(keys, func) {
    keys = toArray(keys);
    for (let key of keys) {
      this.getStream().customize(key, func)
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
        this.dispatchToStream(Xvent.updater.setter(key, binder))
      }
    }
  }

  /**
   * 订阅转发到stream
   * @param updater{Updater}
   */
  dispatchToStream(updater) {
    this.getStream().on(updater)
  }

  kill(keys, actions = [], reOn = false) {
    keys = toArray(keys);
    actions = toArray(actions);
    let killAll = !actions.length;
    for (let key of keys) {
      this.getStream().kill(key, killAll, actions, reOn)
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
    for (let key of keys) {
      this.getStream().kill(key, unbindAll, binders, reOn)
    }
  }
}

Xvent.updater = {
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