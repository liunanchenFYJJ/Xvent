import Store from './store'
import Stream from './stream'
import Updater from './updater'
import privateMap from './privateMap'
import {toArray} from './tool'
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

  pushIntoStream(key, value) {
    this.getStreamCollector().next(key, value)
  }

  getStore() {
    return privateMap.get(this, 'store')
  }

  getStreamCollector() {
    return privateMap.get(this, 'streamCollector')
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
    this.dispatchToStream(keys, Xvent.updater.setter(binders))
  }

  unbind(keys, binders) {

  }

  /**
   * 订阅转发到stream
   * @param keys 订阅源
   * @param anonymousUpdaters 订阅配置
   */
  dispatchToStream(keys, anonymousUpdaters) {
    for (let key of keys) {
      for (let updater of anonymousUpdaters) {
        this.getStreamCollector().on(key, updater)
      }
    }
  }

  kill(keys, actions = [], reOn = false) {
    keys = toArray(keys);
    actions = toArray(actions);
    let killAll = false;
    if (actions.length === 0) {
      killAll = true;
    }
    for (let key of keys) {
      this.getStreamCollector().kill(key, killAll, actions, reOn)
    }
  }

  chew(keys, actions) {
    this.kill(keys, actions, true);
  }
}

Xvent.updater = {
  /**
   * 生成订阅配置对象
   * @param binders
   */
  setter(binders){
    binders = toArray(binders);
    return binders.map(binder => {
      return new Updater(
        observable => {
          observable.subscribe(next => {
            binder[next.key] = next.value
          })
        },
        UPDATER_SETTER,
        false,
        binder
      )
    })
  }
};
