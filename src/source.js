import {Observable, BehaviorSubject} from 'rxjs-es'
export default class Source {
  constructor(name,controller) {
    this.name = name;
    this.flow = controller.$flows.raw
    this.updaters = [];
    this.customize = false;
  }

  sub(updater, needTrace) {
    needTrace && this.updaters.push(updater);
    let {action} = updater;
    updater.subscription = this.flow.subscribe(next => {
      if (this.customize) {
        action.next(next)
      } else {
        let {value, key} = next;
        let observable = null;
        if (value instanceof Promise) {
          observable = Observable.fromPromise(value)
        } else if (value instanceof Observable) {
          observable = value
        } else {
          return action.next(value, key)
        }
        observable.subscribe({
          next(value){
            action.next(value, key)
          },
          error(){
            action.error && action.error()
          },
          complete(){
            action.complete && action.complete()
          },
        })
      }
    });
  }

  pub(key, value) {
    this.flow.next({
      key,
      value,
    });
  }

  replace(func) {
    this.customize = true;
    this.flow = func(this.flow)
  }
}
