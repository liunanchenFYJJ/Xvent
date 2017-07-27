import Dispatcher from './dispather'
import Updater from './updater'
import namespace from './namespace'
import Source from './source'
import Alias from './alias'
import {DEFAULT} from './config'
import {
  toArray,
  reviseArgumentsOfNamespace,
  generateSubscriber,
} from './tool'
import {
  UPDATER_SETTER,
  UPDATER_USER_DEFINE
} from './config'
class Xvent {
  constructor() {
    this.namespace = namespace;
    this.lazySubController = {};
  }

  pushIntoStream(key, value, dispatcher) {
    this.lazySub(dispatcher.name, key);
    this.getSource(dispatcher.name, key).pub(key, value)
  }

  customize(...arg) {
    let {namespace, keys, other: func} = reviseArgumentsOfNamespace(...arg);
    for (let key of toArray(keys)) {
      this.getSource(namespace, key).replace(func)
    }
    return this
  }

  on(...arg) {
    let {namespace, keys, other: actions} = reviseArgumentsOfNamespace(...arg);
    for (let key of toArray(keys)) {
      for (let action of toArray(actions)) {
        let source = this.getSource(namespace, key);
        let subscriber = generateSubscriber(action);
        if (key === '*') {
          this.resolveAsterisk(
            namespace,
            key => new Updater(key, subscriber, UPDATER_USER_DEFINE)
          )
        } else {
          source
            .sub(
              new Updater(key, subscriber, UPDATER_USER_DEFINE),
              true
            )
        }
      }
    }
    return this
  }

  bind(...arg) {
    let {namespace, keys, other: binders} = reviseArgumentsOfNamespace(...arg);
    for (let key of toArray(keys)) {
      for (let binder of toArray(binders)) {
        let source = this.getSource(namespace, key);
        let subscriber = generateSubscriber(next => {
          binder[key] = next
        });
        if (key === '*') {
          this.resolveAsterisk(
            namespace,
            key => new Updater(key, generateSubscriber(next => {
              binder[key] = next
            }), UPDATER_SETTER, binder)
          )
        } else {
          source
            .sub(
              new Updater(key, subscriber, UPDATER_SETTER, binder),
              true
            )
        }
      }
    }
    return this
  }

  lazySub(namespace, key) {
    for (let lazy of this.lazySubController[namespace]) {
      if (!lazy.keys[key]) {
        lazy.keys[key] = true;
        this.getSource(namespace, key).sub(lazy.getUpdater(key), true)
      }
    }
  }

  createDispatcher(name) {
    return new Dispatcher(this, name)
  }

  getSource(name, key) {
    let space;
    if (name === null) {
      space = this.namespace[DEFAULT]
    } else {
      space = this.namespace[name] || (this.namespace[name] = {})
    }
    return space[key] || (space[key] = new Source(key))
  }

  alias(namespace) {
    return new Alias(this, namespace)
  }

  resolveAsterisk(namespace, updaterFactory) {
    if (!this.lazySubController[namespace]) {
      this.lazySubController[namespace] = []
    }
    this.lazySubController[namespace].push({
      getUpdater: (key) => {
        return updaterFactory(key)
      },
      keys: {},
    })
  }
}

export let x = new Xvent();