'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.toArray = toArray;
exports.reviseArgumentsOfNamespace = reviseArgumentsOfNamespace;
exports.generateSubscriber = generateSubscriber;
function toArray(val) {
	return [].concat(val);
}

function reviseArgumentsOfNamespace(namespace, keys, other) {
	if (typeof other === 'undefined') {
		return {
			namespace: null,
			keys: namespace,
			other: keys
		};
	} else {
		return {
			namespace: namespace,
			keys: keys,
			other: other
		};
	}
}

function generateSubscriber(action) {
	var subscriber = {};
	if (typeof action === 'function') {
		subscriber.next = action;
	} else {
		subscriber = action;
	}
	return subscriber;
}