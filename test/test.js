import Xvent from '../src/xvent'
import {Observable} from 'rxjs-es'
let x = Xvent();
let y = Xvent();
// console.log(x === y);

let store = x.getStore();

function log(v) {
  console.log('log: ', v)
}
function log2(v) {
  console.log('log2: ', v)
}
function log3(v) {
  console.log(v, 3)
}
function ajax(result, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(result)
    }, delay)
  })
}
let a = {
  name: 'shujia'
};

x.customize('age', origin => {
  return origin
    .map(r => {
      console.log('customize:', r);
      return {
        key: r.key,
        value: r.value * 10,
      }
    })
});

x.customize('loc', origin => {
  return origin
    .map(r => {
      return Observable.fromPromise(ajax(r.value + '... from promise', 3000))
    })
    .switch()
});
x.on('name', [log, log2]);
x.on('age', [log]);
// x.on('loc', log, false);
// x.bind(['age', 'name'], a);

// x.kill(['name', 'age'], log);
// x.chew('name', log3);//如果原先不存在这个监听函数，那么什么都不会发生
// store.name = 'luwenxu';


let p1 = ajax(10, 2000);
let p2 = ajax('suzhou', 2000);

// store.age = p1;
// store.loc = 'suzhou';
// store.loc = 'nantong';
// store.loc = 'nanjing';

//store.loc = Promise.all([p1, p2]);
let b = {};

let you = x.nameSpace('you');
x.on('name', log3);//没有反应

x.customize('you:name', origin => {
  return origin.map(v => v.value + ' >>> you')
});
x.on('you:name', log, false);
x.bind('you:age', b);
x.unbind('you:age', b);
you.name = 'lovely daidai';
you.age = 10;
console.log(b);

window.store = store;
window.a = a;
window.x = x;
