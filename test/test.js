import {x} from '../src/xvent'
import {Observable, Subject, BehaviorSubject} from 'rxjs-es'

let app = x.controller('app');
let time = x.controller('time');
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

function formatTime() {
}
app.create('click', origin =>
  origin
    .mergeMap(data => Observable.fromPromise(ajax('click of ' + data, 1000)))
)
time.createBehavior('update', origin =>
    origin
      .map(time => new Date()),
  new Date()
)

let appAlias = x.controllerAs('app')
let timeAlias = x.controllerAs('time')
appAlias
  .on('click', log)
timeAlias.on('update', log)

appAlias.dispatch('click', '???')

window.x = x;
