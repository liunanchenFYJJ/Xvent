import {Subject, BehaviorSubject} from 'rxjs-es'
import {empty} from './tool'
export default class Controller {
  constructor(name = null) {
    this.name = name
    this.$flows = {}
    this.$listeners = {}
    this.immediatePub = []
  }

  define(flowName, func, behaviorInitial) {
    let subject = new Subject()
    if (behaviorInitial) {
      subject = new BehaviorSubject(behaviorInitial)
      this.immediatePub.push(flowName)
    }
    let newSubject = subject
    if (typeof func === 'function') {
      newSubject = func(subject)
    }
    newSubject.subscribe(empty)
    this.$flows[flowName] = newSubject
    this.$listeners[flowName] = []
    return this
  }
}