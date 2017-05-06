import { Observable } from 'rxjs-es'
import { XventCore } from './Xvent.core.d'
import Group from './Xvent.group'
// import Listen from './Xvent.listen'
export default class Xvent<T> implements XventCore<T> {
    private groupAdvisor: {
        [prop: string]: Group<T>
    }
    constructor() {
        this.groupAdvisor = {}
    }
    createGroup(name: string, stream: Observable<T>): Group<T> {
        return this.getGroup(name).mergeStream(stream)
    }
    getGroup(name: string): Group<T> {
        if (this.groupAdvisor[name]) {
            return this.groupAdvisor[name]
        } else {
            return this.groupAdvisor[name] = new Group<T>(name, Observable.create(observer => { }))
        }
    }
    group(name: string): Observable<T> {
        return this.getGroup(name).getStream();
    }

    on(type: string, dom: HTMLElement): Observable<T> {
        throw new Error('Method not implemented.');
    }
}