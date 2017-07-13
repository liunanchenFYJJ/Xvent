import Xvent from '../src/xvent'
import {Observable} from 'rxjs-es'
let x = new Xvent();
let y = x.nameSpace('y');

let store = x.getStore();

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

let a = {};

x.customize('name', origin => {
  return origin
    .mergeAll()
    .switchMap(name => {
      return Observable.fromPromise(ajax(name + '...from promise', 1000))
    })
});
x.customize('y', 'age', origin => {
  return origin.map(age => age - 10)
});
// x.on('age',[log,log2]);
x.on('name', log3);
x.bind('name', a);
x.on('y', 'age', log2);
x.bind('y', 'age', a);

// store.name = 'first';
y.age = 25;
// store.name = ajax('wenxu', 1000);
// store.name = ajax('wenxu2', 2000);
store.name = Observable.of('she');
store.name = Observable.of('her');
store.name = Observable.of('me');
// store.name = 'second';

window.x = x;
window.a = a;
