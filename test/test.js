import {x} from '../src/xvent'
import {Observable} from 'rxjs-es'

let dispatcher = x.createDispatcher();
let you = x.createDispatcher('you');
let me = x.createDispatcher('me');

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
  .on('age', log2)
  .on('name', log);

x
  .alias('you')
  .customize('name', origin => {
    return origin
      .mergeAll()
      .map(name => {
        return 'lovely ' + name
      })
  })
  .on('name', log3);

// dispatcher.name = 'wenxu';
// dispatcher.age = 12;

// you.name = Observable.zip(
//   Observable.fromPromise(ajax('daidai', 1000)),
//   Observable.fromPromise(ajax('wenxu', 2000)),
// );
// you.name = ajax('daidai', 1000)

let a = {};
let b = {};
x
  .alias('me')
  .customize('name', origin => {
    return origin.map(name => 'shuai' + name)
  })
  .on('*', log3)
  .bind('*', b)
  .bind('name', a)

me.name = 'wenxu'
me.age = 5
window.x = x;
window.a = a;
window.b = b;
