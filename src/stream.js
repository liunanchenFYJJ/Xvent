import {Subject, Observable} from 'rxjs-es'
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
      this.setStream(key, Observable.fromPromise(value).map(value => (Observable.of({key,value}))));
      this.reOn(key)
    } else {
      this.getStream(key).next(Observable.of({key,value}))
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
    let {action, autoAnalyze} = updater;
    needTrace && this.setTraceOfUpdater(key, updater);
    updater.subscription = this.getStream(key).subscribe(observable => {
      if(autoAnalyze){
        observable.subscribe(next=>{
          action(next.value)
        })
      }else{
        action(observable)
      }
    })
  }

  reOn(key) {
    if (this.updaters.has(key)) {
      let updaters = this.updaters.get(key);
      for (let updater of updaters) {
        updater.subscription.unsubscribe();
        this.on(key, updater, false)
      }
    }
  }

}
