import Store from './store'
import Stream from './stream'
import privateMap from './privateMap'
import {SIMPLE_SETTER} from './config'
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

  on(key, updater) {
    if (updater.UPDATER_TYPE === SIMPLE_SETTER) {
      this.getStreamCollector().on(key, (next) => {
        updater.binder[next.key] = next.value
      })
    } else {
      this.getStreamCollector().on(key, updater)
    }
  }

  bind(key, binder) {
    this.on(key, Xvent.updater.setter(binder))
  }
}

Xvent.updater = {
  setter(binder){
    return {
      UPDATER_TYPE: SIMPLE_SETTER,
      binder,
    }
  }
};