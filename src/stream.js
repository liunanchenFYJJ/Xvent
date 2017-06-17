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
      this.getStream(key).next(Observable.fromPromise(value))
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
    updater.key = key;
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

  /**
   * 取消订阅
   * @param key{string} 需要取消的源
   * @param killAll{boolean} 是否取消所有订阅
   * @param actions{Array} 需要取消的订阅函数。只有当killAll为false的时候才生效
   * @param reOn{boolean} 是否重新订阅
   */
  kill(key, killAll, actions, reOn = false) {
    let updaters = this.updaters.get(key);
    for (let updater of updaters) {
      if (killAll || actions.indexOf(updater.action) !== -1) {
        updater.subscription.unsubscribe();
        if (reOn) {
          this.on(key, updater, false)
        }
      }
    }
  }
}
