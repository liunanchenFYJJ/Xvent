export function toArray(val) {
	return [].concat(val)
}

export function reviseArgumentsOfNamespace(namespace, keys, other) {
	if (typeof other === 'undefined') {
		return {
			$controller: null,
			keys: namespace,
			other: keys,
		}
	} else {
		return {
			$controller,
			keys,
			other,
		}
	}
}

export function generateSubscriber(action) {
	let subscriber = {};
  if (typeof action === 'function') {
    subscriber.next = action
  } else {
    subscriber = action
  }
  return subscriber
}