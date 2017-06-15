import {Subject, Observable} from 'rxjs-es'
import {toArray} from './tool'
export default class Stream {
  constructor() {
    this.updaters = new Map()
  }

  getStream(key) {
    return this[key] || (this[key] = new Subject())
  }

  setStream(key, stream) {
    return (this[key] = stream)
  }

  next(key, value) {
    if (value instanceof Promise) {
      this.setStream(key, Observable.fromPromise(value).map(value => ({key, value,})));
      this.reOn(key)
    } else {
      this.getStream(key).next({key, value,})
    }
  }

  setTraceOfUpdater(key, updater) {
    let updaters = this.updaters.get(key);
    if (!updaters) {
      updaters = []
    }
    updaters = updaters.concat(updater);
    this.updaters.set(key, updaters)
  }

  on(key, updater, needTrace = true) {
    let {action, convertToObservable} = updater;
    needTrace && this.setTraceOfUpdater(key, updater);
    updater.subscription = this.getStream(key).subscribe(next => {
      if(convertToObservable){
        action(Observable.of(next))
      }else{
        action(next)
      }
    })
  }

  reOn(key) {
    if (this.updaters.has(key)) {
      let updaters = this.updaters.get(key);
      for (let updater of updaters) {
        updater.subscription.unsubscribe();
        this.on(key, updater)
      }
    }
  }

}
