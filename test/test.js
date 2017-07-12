import Xvent from '../src/xvent'
import {Observable} from 'rxjs-es'
let x = Xvent();

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
// x.customize('name', origin=>{
//   return origin
//     .mergeAll()
// });
// x.on('age',[log,log2]);
x.on('name', log3);
x.bind('name', a);

store.name = 'first';
// store.name = ajax('wenxu', 1000);
// store.name = ajax('wenxu2', 2000);
// store.name = Observable.of('she');
// store.name = 'second';

let y = x.nameSpace('y');
x.on('y:loc', log);
x.bind('y:loc', a);
y.loc = 'su zhou';

window.a = a;
