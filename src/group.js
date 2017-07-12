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
    let {action, binder} = updater;
    updater.subscription = this.origin.subscribe(next => {
      if (this.customize) {
        action.next(next)
      } else {
        let {key, value} = next;
        let observable = null;
        if (value instanceof Promise) {
          observable = Observable.fromPromise(value)
        } else if (value instanceof Observable) {
          observable = value
        } else {
          observable = Observable.of(value);
        }
        observable.subscribe({
          next(value){
            if (binder) {
              action.next({key, value})
            } else {
              action.next(value)
            }
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
    if (this.customize) {
      this.origin.next(value)
    } else {
      this.origin.next({
        key,
        value,
      });
    }
  }

  doCustomize(func) {
    this.customize = true;
    this.origin = func(this.origin)
  }
}
