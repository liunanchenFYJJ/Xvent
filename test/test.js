import Xvent from '../index'
let x = new Xvent();

let store = x.getStore();

function log(v) {
  console.log(v)
}
function log2(v) {
  console.log(v, 2)
}
function log3(v) {
  console.log(v, 3)
}
function ajax(result, delay) {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(result)
    }, delay)
  })
}
let a = {
  name: 'shujia'
};
x.on('name', [log, log2]);
x.bind(['age', 'name'], a);
x.on('loc', (observable=>{
  observable.subscribe({
    next(val){
      log(val)
    },
    complete(){
      log('complete')
    }
  })
}),false);

x.kill('name', log);
x.chew('name', log3);
store.name = 'luwenxu';

//store.loc = new Promise((resolve) => {
//  resolve('suzhou')
//})


let p1 = ajax('p1', 1000);
let p2 = ajax('p2', 2000);
//store.loc = Promise.all([p1, p2]);

window.store = store;
window.a = a;
window.x = x;
