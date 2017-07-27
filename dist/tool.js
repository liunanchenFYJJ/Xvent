'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.toArray = toArray;
exports.reviseArgumentsOfNamespace = reviseArgumentsOfNamespace;
function toArray(val) {
	return [].concat(val);
}

function reviseArgumentsOfNamespace(namespace, keys, other) {
	if (typeof other === 'undefined') {
		return {
			sourceSpace: null,
			keys: namespace,
			other: keys
		};
	} else {
		return {
			sourceSpace: namespace,
			keys: keys,
			other: other
		};
	}
}