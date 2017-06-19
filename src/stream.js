import {Subject, Observable} from 'rxjs-es'
export default class Stream {
  constructor() {
    this.updaters = new Map()
  }

  getOrigin(key) {
    return this[key] || (this[key] = new Subject())
  }

  setOrigin(key, origin) {
    return (this[key] = origin)
  }

  next(key, value) {
    let origin = this.getOrigin(key);
    if (value instanceof Promise) {
      Observable.fromPromise(value).subscribe({
        next(result){
          origin.next({key, value:result})
        },
        error(){
          origin.error()
        },
        complete(){
          origin.complete()
        },
      });
    } else {
      origin.next({key, value})
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

  customize(key, func) {
    this.setOrigin(key, func(this.getOrigin(key)));
  }

  on(updater, needTrace = true) {
    let {key, action, autoAnalyze} = updater;
    needTrace && this.setTraceOfUpdater(key, updater);
    let origin = this.getOrigin(key);
    updater.subscription = this.getOrigin(key).subscribe(next => {
      if (autoAnalyze) {
        action(next.value)
      } else {
        action(next)
      }
    });
    return origin
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
          this.on(updater, false)
        }
      }
    }
  }
}
