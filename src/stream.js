import Source from './source'
import {DEFAULT} from './config'
export default class Stream {
  constructor() {
    this[DEFAULT] = {}
  }

  getNameSpace(name) {
    if (name === null) {
      return this[DEFAULT]
    }
    return this[name] || (this[name] = {})
  }

  getSource(nameSpace, key) {
    let space = this.getNameSpace(nameSpace);
    return space[key] || (space[key] = new Source(key))
  }

  next(key, value, nameSpace) {
    this.getSource(nameSpace, key).pub(key, value);
  }

  customize(nameSpace, key, func) {
    this.getSource(nameSpace, key).doCustomize(func)
  }

  on(updater, needTrace = true) {
    this.getSource(updater.nameSpace, updater.key).sub(updater, needTrace);
  }

  kill(key, killAll, unSub, reOn = false) {
    let source = this.getSource(key);
    source.kill(key, killAll, unSub, reOn);
  }
}
