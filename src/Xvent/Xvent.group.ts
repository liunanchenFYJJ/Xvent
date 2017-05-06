import { Observable } from 'rxjs-es'
import { XventGroup } from './Xvent.group.d'

export default class Group<T> implements XventGroup<T>{
    constructor(private groupName: String, private stream: Observable<T>) {

    }
    mergeStream(stream: Observable<T>):Group<T> {
        this.setStream(this.stream.merge(stream))
        return this
    }
    setStream(stream: Observable<T>): Group<T> {
        this.stream = stream
        return this
    }
    getStream(): Observable<T> {
        return this.stream
    }

}