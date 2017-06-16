import Store from './store'
import Stream from './stream'
import privateMap from './privateMap'
import {toArray} from './tool'
import {
  UPDATER_TYPE, UPDATER_SETTER, UPDATER_USER_DEFINE,
} from './config'
export default class Xvent {
  constructor() {
    privateMap.init(this, {
      store: new Store(this),
      streamCollector: new Stream(),
    })
  }

  static prepareUpdater(action, updaterType, autoAnalyze) {
    return {
      action,
      updaterType,
      autoAnalyze,
    }
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
    let updaters = actions.map(action => {
      return Xvent.prepareUpdater(action, UPDATER_USER_DEFINE, autoAnalyze)
    });
    this.dispatchToStream(keys, updaters);
  }

  dispatchToStream(keys, updaters) {
    for(let key of keys){
      for(let updater of updaters){
        this.getStreamCollector().on(key, updater)
      }
    }
  }

  bind(keys, binders, autoAnalyze = true) {
    this.dispatchToStream(keys, Xvent.updater.setter(binders, autoAnalyze))
  }
}

Xvent.updater = {
  setter(binders, autoAnalyze){
    binders = toArray(binders);
    return binders.map(binder => {
      return Xvent.prepareUpdater(
        next => {
          binder[next.key] = next.value
        },
        UPDATER_SETTER,
        autoAnalyze
      )
    })
  }
};
