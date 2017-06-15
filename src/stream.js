import {Subject, Observable} from 'rxjs-es'
import {toArray} from './tool'
export default class Stream {
  constructor() {
    this.listendStreams = new Map()
  }

  getStream(key) {
    return this[key] || (this[key] = new Subject())
  }

  setStream(key, stream) {
    return (this[key] = stream)
  }

  next(key, value) {
    if (value instanceof Promise) {
      this.setStream(key, Observable.fromPromise(value).map(value=>({key,value,})));
      this.reOn(key)
    } else {
      this.getStream(key).next({key,value,})
    }
  }

  setTraceOfListeners(key, updaters) {
    let listeners = this.listendStreams.get(key);
    if (!listeners) {
      listeners = []
    }
    listeners = listeners.concat(updaters);
    this.listendStreams.set(key, listeners)
  }

  on(keys, updaters, needTrace = true) {
    keys = toArray(keys);
    updaters = toArray(updaters);
    for (let key of keys) {
      needTrace && this.setTraceOfListeners(key, updaters);
      this.getStream(key).subscribe(next => {
        for (let updater of updaters) {
          updater(next)
        }
      })
    }
  }

  reOn(key) {
    if (this.listendStreams.has(key)) {
      let listeners = this.listendStreams.get(key);
      this.on(key, listeners, false)
    }
  }

}
