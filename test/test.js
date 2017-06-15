import Xvent from '../index'
let x = new Xvent();

let store = x.getStore();

function log(v) {
  console.log(v)
}
function log2(v) {
  console.log(v, 2)
}
let a = {
  name: 'shujia'
};
x.on('name', [log, log2]);
x.bind(['age', 'name'], a);
x.on('location',function(next){

});
// store.name = 'luwenxu';
// store.p=new Promise(resolve=>{
//   resolve(1)
// });
// x.on('p',next=>{
//   console.log(next)
// });
window.store = store;
window.a=a;
window.x=x;