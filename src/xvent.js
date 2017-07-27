import Dispatcher from './dispather'
import Updater from './updater'
import namespace from './namespace'
import Source from './source'
import Alias from './alias'
import {DEFAULT} from './config'
import {
	toArray,
	reviseArgumentsOfNamespace
} from './tool'
import {
	UPDATER_SETTER,
	UPDATER_USER_DEFINE
} from './config'
class Xvent {
	constructor() {
		this.namespace = namespace;
	}

	pushIntoStream(key, value, dispatcher) {
		this.getSource(dispatcher.name, key).pub(key, value)
	}

	customize(...arg) {
		let {namespace, keys, other: func} = reviseArgumentsOfNamespace(...arg);
		for (let key of toArray(keys)) {
			this.getSource(namespace, key).replace(func)
		}
		return this
	}

	on(...arg) {
		let {namespace, keys, other: actions} = reviseArgumentsOfNamespace(...arg);
		for (let key of toArray(keys)) {
			for (let action of toArray(actions)) {
				this
					.getSource(namespace, key)
					.sub(
						new Updater(namespace, key, action, UPDATER_USER_DEFINE),
						true
					)
			}
		}
		return this
	}

	bind(...arg) {
		let {namespace, keys, other: binders} = reviseArgumentsOfNamespace(...arg);
		for (let key of toArray(keys)) {
			for (let binder of toArray(binders)) {
				this
					.getSource(namespace, key)
					.sub(
						new Updater(
							namespace,
							key,
							next => {
								binder[key] = next
							},
							UPDATER_SETTER,
							binder
						),
						true
					)
			}
		}
		return this
	}

	createDispatcher(name) {
		return new Dispatcher(this, name)
	}

	getSource(name, key) {
		let space;
		if (name === null) {
			space = this.namespace[DEFAULT]
		} else {
			space = this.namespace[name] || (this.namespace[name] = {})
		}
		return space[key] || (space[key] = new Source(key))
	}

	alias(namespace) {
	  return new Alias(this, namespace)
  }
}

export let x = new Xvent();