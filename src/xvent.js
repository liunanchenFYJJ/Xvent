import Store from './store'
import Stream from './stream'
import Updater from './updater'
import privateMap from './privateMap'
import {toArray} from './tool'
import {Observable} from 'rxjs-es'
import {
  UPDATER_TYPE, UPDATER_SETTER, UPDATER_USER_DEFINE
} from './config'
export default class Xvent {
  constructor() {
    privateMap.init(this, {
      store: new Store(this),
      streamCollector: new Stream(),
    })
  }

  static to(key, value) {
    return {key, value}
  }

  pushIntoStream(key, value) {
    this.getStreamCollector().next(key, value)
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
        this.dispatchToStream(Xvent.updater.setter(key, binder))
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

  chew(keys, actions) {
    this.kill(keys, actions, true);
  }

  unbind(keys, binders) {

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
        console.log(next);
        binder[next.key] = next.value
      },
      UPDATER_SETTER,
      false,
      binder
    )
  }
};
