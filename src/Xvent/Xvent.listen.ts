import { Observable } from 'rxjs-es'
import Hammer from 'hammerjs'
import { XventListen } from './Xvent.listen.d'
import { touchType } from '../config/touchType.config'

export default class Listen<T> implements XventListen<T> {
    on(type: string, data: any, dom: HTMLElement): Observable<T> {
        return Observable.fromEventPattern<T>(next => {
            if (touchType.indexOf(type) === -1) {
                let recognizor = new Hammer(dom);
                recognizor.on(type, e => {
                    next({ data, e })
                })
            } else {
                dom.addEventListener(type, e => {
                    next({ data, e })
                })
            }

        }, error => { })
    }
}