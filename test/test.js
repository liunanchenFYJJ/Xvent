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
        .mergeMap(data => Observable.fromPromise(ajax([1, 2, 3], 1000)))
        .do(data => {
          appAlias.dispatch('epc', data)
        })
  )
  .create('epc', origin =>
    origin.do(log2));

time
  .create(
    'update',
    origin => origin.map(time => new Date()),
    true,
    new Date()
  )

appAlias
  .on('click', log)
  .on('*', log2)
timeAlias.on('update', log)

appAlias.dispatch('click', '???')
timeAlias.dispatch('update')

window.x = x;
