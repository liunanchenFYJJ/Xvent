export default class Store {
  constructor(xvent, nameSpace = null) {
    return new Proxy({}, {
      get: (target, key, receiver) => {
        return Reflect.get(target, key, receiver)
      },
      set: (target, key, value, receiver) => {
        xvent.pushIntoStream(key, value, nameSpace);
        return Reflect.set(target, key, value, receiver)
      }
    })
  }
}
