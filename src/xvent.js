import Controller from './controller'
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
    this.$controller = {}
    this.$controllers = {}
    this.lazySubController = {};
  }

  dispatch(controllerName, flow, value) {
    // this.lazySub(controller.name, key);
    this.$controllers[controllerName].pub(flow, value)
  }


  on(controllerName, flows, actions) {
    for (let flow of toArray(flows)) {
      for (let action of toArray(actions)) {
        let controller = this.$controllers[controllerName];
        let observer = generateSubscriber(action);
        if (flow === '*') {
          this.resolveAsterisk(
            controllerName,
            key => new Updater(key, observer, UPDATER_USER_DEFINE)
          )
        }
        controller.sub(flow, observer)
      }
    }
    return this
  }


  lazySub(namespace, key) {
    if (this.lazySubController[namespace]) {
      for (let lazy of this.lazySubController[namespace]) {
        if (!lazy.keys[key]) {
          lazy.keys[key] = true;
          this.getSource(namespace, key).sub(lazy.getUpdater(key), true)
        }
      }
    }
  }

  controller(name) {
    return this.$controllers[name] = new Controller(this, name);
  }

  controllerAs(controller) {
    return new Alias(this, controller)
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
