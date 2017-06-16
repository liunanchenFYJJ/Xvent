export default class Store {
  constructor(xvent) {
    return new Proxy(this, {
      get: (target, key, receiver) => {
        return Reflect.get(target, key, receiver)
      },
      set: (target, key, value, receiver) => {
        xvent.pushIntoStream(key, value);
        return Reflect.set(target, key, value, receiver)
      }
    })
  }
}
