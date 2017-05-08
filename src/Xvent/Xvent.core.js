import { Observable } from 'rxjs-es';
import Group from './Xvent.group';
// import Listen from './Xvent.listen'
export default class Xvent {
    constructor() {
        this.groupAdvisor = {};
    }
    createGroup(name, stream) {
        return this.getGroup(name).mergeStream(stream);
    }
    getGroup(name) {
        if (this.groupAdvisor[name]) {
            return this.groupAdvisor[name];
        }
        else {
            return this.groupAdvisor[name] = new Group(name, Observable.create(observer => { }));
        }
    }
    group(name) {
        return this.getGroup(name).getStream();
    }
    on(type, dom) {
        throw new Error('Method not implemented.');
    }
}
