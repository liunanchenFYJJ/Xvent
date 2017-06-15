let privateMap = new WeakMap();
export default {
  get(obj, key){
    try {
      if (privateMap.has(obj)) {
        return privateMap.get(obj)[key]
      } else {
        throw new Error('no such private data for ' + obj.toString())
      }
    } catch (err) {
      throw err
    }
  },
  set(obj, key, value){
    try {
      if (privateMap.has(obj)) {
        privateMap.get(obj)[key] = value
      }
    } catch (err) {
      throw err
    }
  },
  init(obj, initial){
    privateMap.set(obj, initial)
  }
}
