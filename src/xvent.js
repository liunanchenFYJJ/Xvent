import Store from './store'
import Stream from './stream'
import Updater from './updater'
import privateMap from './privateMap'
import {toArray} from './tool'
import {
  UPDATER_SETTER, UPDATER_USER_DEFINE
} from './config'
export default class Xvent {
  constructor() {
    privateMap.init(this, {
      store: new Store(this),
      stream: new Stream(),
    })
  }

  pushIntoStream(key, value, nameSpace) {
    this.getStream().next(key, value, nameSpace)
  }

  getStore() {
    return privateMap.get(this, 'store')
  }

  getStream() {
    return privateMap.get(this, 'stream')
  }

  customize(nameSpace, keys, func) {
    if (typeof func === 'undefined') {
      func = keys;
      keys = nameSpace;
      nameSpace = null;
    }
    keys = toArray(keys);
    for (let key of keys) {
      this.getStream().customize(nameSpace, key, func)
    }
  }

  on(nameSpace, keys, actions) {
    if (typeof actions === 'undefined') {
      actions = keys;
      keys = nameSpace;
      nameSpace = null;
    }
    keys = toArray(keys);
    actions = toArray(actions);
    for (let key of keys) {
      for (let action of actions) {
        this.dispatchToStream(new Updater(nameSpace, key, action, UPDATER_USER_DEFINE))
      }
    }
  }

  bind(nameSpace, keys, binders) {
    if (typeof binders === 'undefined') {
      binders = keys;
      keys = nameSpace;
      nameSpace = null;
    }
    keys = toArray(keys);
    binders = toArray(binders);
    for (let key of keys) {
      for (let binder of binders) {
        this.dispatchToStream(
          new Updater(
            nameSpace,
            key,
            next => {
              binder[key] = next
            },
            UPDATER_SETTER,
            binder
          ))
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

  nameSpace(spaceName) {
    return new Store(this, spaceName)
  }
}