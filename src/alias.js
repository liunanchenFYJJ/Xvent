export default class Alias {
  constructor(xvent, controller) {
    this.xvent = xvent;
    this.$controller = controller;
  }

  bind(...arg) {
    this.xvent.bind(this.$controller, ...arg);
    return this
  }

  on(...arg) {
    this.xvent.on(this.$controller, ...arg);
    return this
  }

  dispatch(...arg) {
    this.xvent.dispatch(this.$controller, ...arg);
    return this
  }
}