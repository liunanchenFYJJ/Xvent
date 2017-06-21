export let store_nameSpace = {};
export default class Store {
  constructor(xvent, nameSpace = '') {
    if (nameSpace) {
      store_nameSpace[nameSpace] = true
    }
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
