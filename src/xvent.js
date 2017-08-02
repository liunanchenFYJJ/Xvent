import Controller from './controller'
import Alias from './alias'
import {
  toArray,
  generateSubscriber,
  pub,
  sub,
} from './tool'

class Xvent {
  constructor() {
    this.$controllers = {}
    this.$lazySubs = {}
  }

  dispatch(controllerName, flow, value) {
    // this.lazySub(controller.name, key);
    pub(this.$controllers[controllerName], flow, value)
  }


  on(controllerName, flows, actions) {
    for (let flow of toArray(flows)) {
      for (let action of toArray(actions)) {
        let controller = this.$controllers[controllerName]
        let observer = generateSubscriber(action)
        if (flow === '*') {
          this.resolveAsterisk(controllerName, observer)
        } else {
          sub(controller, flow, observer)
        }
      }
    }
    return this
  }

  bind(controllerName, flows, binders) {
    for (let flow of toArray(flows)) {
      for (let binder of toArray(binders)) {
        let controller = this.$controllers[controllerName]
        // let observer = generateSubscriber(action);
        if (flow === '*') {
          this.resolveAsterisk()
        }
        sub(controller, flow, value => {
          binder[flow] = value
        })
      }
    }
    return this
  }


  lazySub(namespace, key) {
    if (this.$lazySubs[namespace]) {
      for (let lazy of this.$lazySubs[namespace]) {
        if (!lazy.keys[key]) {
          lazy.keys[key] = true;
          this.getSource(namespace, key).sub(lazy.getUpdater(key), true)
        }
      }
    }
  }

  controller(name) {
    return this.$controllers[name] = new Controller(this, name)
  }

  controllerAs(controller) {
    return new Alias(this, controller)
  }

  resolveAsterisk(controller, flow, observer) {
    if (!this.$lazySubs[controller]) {
      this.$lazySubs[controller] = []
    }
    this.$lazySubs[namespace].push({
      getUpdater: (key) => {
        return updaterFactory(key)
      },
      keys: {},
    })
  }
}

export let x = new Xvent();