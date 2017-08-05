import {x} from '../src/xvent'
import {Observable} from 'rxjs-es'

let app = x.controller('app');
let time = x.controller('time');
let appAlias = x.space('app')
let timeAlias = x.space('time')
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
let epcs = [
  {
    id: 1,
    name: 'demo',
  },
  {
    id: 2,
    name: 'admin',
  },
]
let ips = [
  {
    epc: 'demo',
    ip: '0.0.0.0',
  },
  {
    epc: 'admin',
    ip: '1.1.1.1',
  },
]

function ajax(result, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(result)
    }, delay)
  })
}

app
  .define(
    'mounted',
    origin =>
      origin
        .do(() => {
          log2('start')
        })
        .mergeMap(
          data => Observable.fromPromise(ajax(epcs, 1000)))
        .do(data => {
          // appAlias.dispatch('epc', data)
        })
  )
  .define('epc', origin =>
    origin.do(log2)
  )
  .define('name', null, 'somebody')

time
  .define(
    'update',
    origin => origin.map(time => new Date()),
    new Date()
  )

// appAlias.on('mounted', log3)
appAlias.dispatch('mounted')
window.x = x
window.a = a
window.b = b
