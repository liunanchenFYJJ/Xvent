export default class Alias {
  constructor(xvent, namespace) {
    this.xvent = xvent;
    this.namespace = namespace;
  }

  bind(...arg) {
    this.xvent.bind(this.namespace, ...arg);
    return this
  }

  on(...arg) {
    this.xvent.on(this.namespace, ...arg);
    return this
  }

  customize(...arg) {
    this.xvent.customize(this.namespace, ...arg);
    return this
  }
}