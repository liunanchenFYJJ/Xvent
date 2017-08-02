import {Subject, BehaviorSubject} from 'rxjs-es'
export default class Controller {
  constructor(xvent, name = null) {
    // this.$x = xvent;
    this.name = name
    this.$flows = {
      raw: {},
      processed: {},
    }
    this.$listeners = {}
  }

  create(flowName, func, immediatelyPubWhenSub, initial) {
    let subject = new Subject()
    if (immediatelyPubWhenSub) {
      subject = new BehaviorSubject(initial)
    }
    this.$flows.raw[flowName] = subject
    this.$flows.processed[flowName] = func(subject)
    this.$listeners[flowName] = []
    return this
  }
}