export default class Store {
  constructor(xvent, nameSpace = '') {
    return new Proxy({}, {
      get: (target, key, receiver) => {
        return Reflect.get(target, key, receiver)
      },
      set: (target, key, value, receiver) => {
        xvent.pushIntoStream(nameSpace + key, value);
        return Reflect.set(target, key, value, receiver)
      }
    })
  }
}
