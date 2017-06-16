import Store from './store'
import Stream from './stream'
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
    let anonymousUpdaters = actions.map(action => {
      return Xvent.prepareUpdater(action, UPDATER_USER_DEFINE, autoAnalyze)
    });
    this.dispatchToStream(keys, anonymousUpdaters);
  }

  bind(keys, binders) {
    this.dispatchToStream(keys, Xvent.updater.setter(binders))
  }

  dispatchToStream(keys, anonymousUpdaters) {
    for(let key of keys){
      for(let updater of anonymousUpdaters){
        this.getStreamCollector().on(key, updater)
      }
    }
  }

  kill(key, actions = [], reOn = false) {
    actions = toArray(actions);
    let killAll = false;
    if(actions.length === 0){
      killAll = true;
    }
    this.getStreamCollector().kill(key, killAll, actions, reOn)
  }

  chew(key, actions) {
    this.kill(key, actions, true);
  }
}

Xvent.updater = {
  setter(binders){
    binders = toArray(binders);
    return binders.map(binder => {
      return Xvent.prepareUpdater(
        observable => {
          observable.subscribe(next=>{
            binder[next.key] = next.value
          })
        },
        UPDATER_SETTER,
        false
      )
    })
  }
};
