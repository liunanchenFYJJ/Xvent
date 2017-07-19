import {x} from '../src/xvent'
import {Observable} from 'rxjs-es'

let dispatcher = x.createDispatcher();
let you = x.createDispatcher('you');

function log(v) {
	console.log('log: ', v)
}
function log2(v) {
	console.log('log2: ', v)
}
function log3(v) {
	console.log('log3: ', v)
}
function ajax(result, delay) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(result)
		}, delay)
	})
}

x
	.customize('age', origin => {
		return origin.map(age => {
			return age + 10
		})
	})
	.on('age', log2);

x
	.customize('you', 'name', origin => {
		return origin
			.mergeAll()
			.map(name => 'lovely ' + name)
	})
	.on('you', 'name', log3);

dispatcher.name = 'wenxu';
dispatcher.age = 12;

// you.name = Observable.zip(
// 	Observable.fromPromise(ajax('daidai', 1000)),
// 	Observable.fromPromise(ajax('wenxu', 2000)),
// );
you.name = ajax('daidai', 1000)
let a = {};

window.x = x;
window.a = a;
