import { Observable } from 'rxjs-es'
export interface XventGroup<T> {
    mergeStream(stream: Observable<T>): XventGroup<T>
    setStream(stream: Observable<T>): XventGroup<T>
    getStream(): Observable<T>
}