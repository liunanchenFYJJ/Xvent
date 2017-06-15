import Xvent from '../index'
let x = new Xvent();

let store=x.getStore();

x.on('name',next=>{
  console.log(next)
});
x.on('name',next=>{
  console.log(next,2)
});
store.name='luwenxu';
// store.p=new Promise(resolve=>{
//   resolve(1)
// });
// x.on('p',next=>{
//   console.log(next)
// });
console.log(store)