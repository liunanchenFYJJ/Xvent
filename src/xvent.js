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

  on(controllerName, flows, observers) {
    for (let flow of toArray(flows)) {
      for (let observer of toArray(observers)) {
        this.listen(controllerName, flow, observer, () => observer)
      }
    }
    return this
  }

  bind(controllerName, flows, binders) {
    for (let flow of toArray(flows)) {
      for (let binder of toArray(binders)) {
        this.listen(
          controllerName,
          flow,
          value => binder[flow] = value,
          flow => value => binder[flow] = value
        )
      }
    }
    return this
  }

  listen(controllerName, flow, observer, observerFactory) {
    let controller = this.$controllers[controllerName]
    if (flow instanceof RegExp) {
      this.resolveRegex(controllerName, flow, observerFactory)
      if (controller.immediatePub.length) {
        for (let immediatePub of controller.immediatePub) {
          this.checkLazySubs(controllerName, immediatePub)
        }
      }
    } else {
      sub(controller, flow, observer)
    }
  }

  controller(name) {
    return this.$controllers[name] = new Controller(name)
  }

  space(controller) {
    return new Alias(this, controller)
  }

  resolveRegex(controllerName, flowRegex, observerFactory) {
    if (!this.$lazySubs[controllerName]) {
      this.$lazySubs[controllerName] = []
    }
    this.$lazySubs[controllerName].push({
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