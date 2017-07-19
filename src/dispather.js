export default class Dispatcher {
  constructor(xvent, name = null) {
    this.name = name;
    return new Proxy({}, {
      get: (target, key, receiver) => {
        return Reflect.get(target, key, receiver)
      },
      set: (target, key, value, receiver) => {
        xvent.pushIntoStream(key, value, this);
        return Reflect.set(target, key, value, receiver)
      }
    })
  }
}
