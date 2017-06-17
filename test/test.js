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
  return origin.map(v => {
    let r = Xvent.to('age',v.value * 10);
    console.log(r);
    return r
  })
});
x.on('name', [log, log2]);
x.on('age',log);
x.bind(['age', 'name'], a);
x.on('loc', (observable => {
  observable.subscribe({
    next(val){
      log(val)
    },
    complete(){
      log('complete')
    }
  })
}), false);

// x.kill(['name','age'], log);
// x.chew('name', log3);//如果原先不存在这个监听函数，那么什么都不会发生
// store.name = 'luwenxu';

//store.loc = new Promise((resolve) => {
//  resolve('suzhou')
//})


let p1 = ajax('p1', 1000);
let p2 = ajax('p2', 2000);
//store.loc = Promise.all([p1, p2]);

window.store = store;
window.a = a;
window.x = x;
