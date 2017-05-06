declare interface HammerConsturtor{
    new (dom:HTMLElement)
}

import { Observable } from 'rxjs-es'
export interface XventListen<T> {
    on(type: string, data: any, dom: HTMLElement): Observable<T>
}