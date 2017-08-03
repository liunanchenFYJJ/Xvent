import {Subject, BehaviorSubject} from 'rxjs-es'
export default class Controller {
  constructor(name = null) {
    this.name = name
    this.$flows = {
      raw: {},
      processed: {},
    }
    this.$listeners = {}
    this.immediatePub = []
  }

  create(flowName, func, immediatelyPubWhenSub, initial) {
    let subject = new Subject()
    if (immediatelyPubWhenSub) {
      subject = new BehaviorSubject(initial)
      this.immediatePub.push(flowName)
    }
    let newSubject = subject
    if (typeof func === 'function') {
      newSubject = func(subject)
    }
    this.$flows.raw[flowName] = subject
    this.$flows.processed[flowName] = newSubject
    this.$listeners[flowName] = []
    return this
  }
}