import { XventListen } from './Xvent.listen.d'
import { Observable } from 'rxjs-es'
import { touchType } from '../config/touchType.config'
export default class Listen<T> implements XventListen<T> {
    on(type: string, data: any, dom: HTMLElement): Observable<T> {
        return Observable.fromEventPattern<T>(next => {
            dom.addEventListener(type, e => {
                next(e, data)
            })
        }, error => { })
    }
}