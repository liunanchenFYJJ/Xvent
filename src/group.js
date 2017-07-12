import {Observable, Subject} from 'rxjs-es'
export default class Group {
  constructor(name) {
    this.name = name;
    this.origin = new Subject();
    this.updaters = [];
    this.customize = false;
  }

  sub(updater, needTrace) {
    needTrace && this.updaters.push(updater);
    let {action, autoAnalyze} = updater;
    updater.subscription = this.origin.subscribe(next => {
      let {value} = next;
      let observable = null;
      if (value instanceof Promise) {
        observable = Observable.fromPromise(value)
      } else if (value instanceof Observable) {
        observable = value
      } else {
        observable = Observable.of(value);
      }
      observable.subscribe({
        next(result){
          if (autoAnalyze) {
            action.next(result)
          } else {
            action.next(next)
          }
        },
        error(){
          action.error && action.error()
        },
        complete(){
          action.complete && action.complete()
        },
      })
    });
  }

  pub(key, value) {
    this.origin.next({
      key,
      value,
    });
  }

  doCustomize(func) {
    this.customize = true;
    this.origin = func(this.origin)
  }
}
