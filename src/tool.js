export function toArray(val) {
	return [].concat(val)
}

export function reviseArgumentsOfNamespace(namespace, keys, other) {
	if (typeof other === 'undefined') {
		return {
			namespace: null,
			keys: namespace,
			other: keys,
		}
	} else {
		return {
			namespace,
			keys,
			other,
		}
	}
}