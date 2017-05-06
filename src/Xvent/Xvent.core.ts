import { Observable } from 'rxjs-es'
import { XventCore } from './Xvent.core.d'
import Group from './Xvent.group'
export default class Xvent<T> implements XventCore<T> {
    private groupAdvisor: {
        [prop: string]: Group<T>
    }
    constructor() {
        this.groupAdvisor = {}
    }
    createGroup(name: string, stream: Observable<T>): Group<T> {
        let newGroup: Group<T>
        try {
            newGroup = this.getGroup(name)
            newGroup.mergeStream(stream)
        } catch (err) {
            newGroup = this.groupAdvisor[name] = new Group<T>(name, stream)
        }
        return newGroup
    }
    getGroup(name: string): Group<T> {
        if (this.groupAdvisor[name]) {
            return this.groupAdvisor[name]
        } else {
            throw new Error('no such group : ' + name)
        }
    }

    on(type: string, dom: HTMLElement): Observable<T> {
        throw new Error('Method not implemented.');
    }
}