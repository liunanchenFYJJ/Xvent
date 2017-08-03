import {x} from '../src/xvent'
import {Observable} from 'rxjs-es'

let app = x.controller('app');
let time = x.controller('time');
let appAlias = x.controllerAs('app')
let timeAlias = x.controllerAs('time')
function log(v) {
  console.log('log: ', v)
}
function log2(v) {
  console.log('log2: ', v)
}
function log3(v) {
  console.log('log3: ', v)
}

let a = {}
let b = {}
function ajax(result, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(result)
    }, delay)
  })
}

app
  .create(
    'click',
    origin =>
      origin
        .mergeMap(
          data => Observable.fromPromise(ajax('click of ' + data, 1000)))
        .do(data => {
          // appAlias.dispatch('epc', data)
        })
  )
  .create('epc', origin =>
    origin.do(log2)
  )
  .create('nameBind', null, true, 'somebody')
  .create('name.log2', null, true, 'daidai')

time
  .create(
    'update',
    origin => origin.map(time => new Date()),
    true,
    new Date()
  )

appAlias
// .on('click', log)
  .on(/.*/, log)
  .on(/.log2/, log2)
  .bind(/Bind\b/, a)
// timeAlias.on('update', log3)

// appAlias.dispatch('click', '???')
appAlias.dispatch('name.log2', 'wenxu')
appAlias.dispatch('nameBind', 'other')

window.x = x
window.a = a
window.b = b
