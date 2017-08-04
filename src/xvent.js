import Controller from './controller'
import Alias from './alias'
import {
  toArray,
  pub,
  sub,
} from './tool'

class Xvent {
  constructor() {
    this.$controllers = {}
    this.$lazySubs = {}
    this.$subInfo = {}
  }

  dispatch(controllerName, flow, value) {
    this.checkLazySubs(controllerName, flow)
    pub(this.$controllers[controllerName], flow, value)
  }

  on(controllerName, flows, actions) {
    for (let flow of toArray(flows)) {
      for (let action of toArray(actions)) {
        let controller = this.$controllers[controllerName]
        if (flow instanceof RegExp) {
          this.resolveRegex(controllerName, flow, () => action)
          if (controller.immediatePub.length) {
            for (let immediatePub of controller.immediatePub) {
              this.checkLazySubs(controllerName, immediatePub)
            }
          }
        } else {
          sub(controller, flow, action)
        }
      }
    }
    return this
  }

  bind(controllerName, flows, binders) {
    for (let flow of toArray(flows)) {
      for (let binder of toArray(binders)) {
        let controller = this.$controllers[controllerName]
        if (flow instanceof RegExp) {
          this.resolveRegex(controllerName, flow, flow => value => {
            binder[flow] = value
          })
          if (controller.immediatePub.length) {
            for (let immediatePub of controller.immediatePub) {
              this.checkLazySubs(controllerName, immediatePub)
            }
          }
        } else {
          sub(controller, flow, value => {
            binder[flow] = value
          })
        }
      }
    }
    return this
  }

  controller(name) {
    return this.$controllers[name] = new Controller(name)
  }

  controllerAs(controller) {
    return new Alias(this, controller)
  }

  resolveRegex(controller, flowRegex, observerFactory) {
    if (!this.$lazySubs[controller]) {
      this.$lazySubs[controller] = []
    }
    this.$lazySubs[controller].push({
      flowRegex,
      subs: {},
      observerFactory,
    })
  }

  checkLazySubs(controller, flow) {
    let lazySubs = this.$lazySubs[controller]
    if (lazySubs) {
      for (let lazy of lazySubs) {
        if (!lazy.subs[flow]) {
          if (lazy.flowRegex.test(flow)) {
            lazy.subs[flow] = true;
            sub(this.$controllers[controller], flow, lazy.observerFactory(flow))
          }
        }
      }
    }
  }
}

export let x = new Xvent();