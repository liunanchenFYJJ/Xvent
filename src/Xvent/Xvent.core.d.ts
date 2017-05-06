import { Observable } from 'rxjs-es';
import { XventGroup } from './Xvent.group.d'
import { XventListen } from './Xvent.listen.d'
export interface XventCore<T> {
    createGroup(name: string, stream: Observable<T>): XventGroup<T>
    getGroup(name: string): XventGroup<T>
    on(type: string, dom: HTMLElement): Observable<T>
}