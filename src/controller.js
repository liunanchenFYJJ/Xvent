import {Subject, BehaviorSubject} from 'rxjs-es'
export default class Controller {
  constructor(xvent, name = null) {
    // this.$x = xvent;
    this.name = name;
    this.$flows = {
      raw: {},
      processed: {},
    };
  }

  create(flowName, func) {
    this.doCreate(flowName, new Subject(), func)
  }

  createBehavior(flowName, func, initial = null) {
    this.doCreate(flowName, new BehaviorSubject(initial), func)
  }

  doCreate(flowName, subject, func) {
    this.$flows.raw[flowName] = subject;
    this.$flows.processed[flowName] = func(subject);
  }

  pub(flow, value) {
    this.$flows.raw[flow].next(value)
  }

  sub(flow, observer) {
    this.$flows.processed[flow].subscribe(observer)
  }
}