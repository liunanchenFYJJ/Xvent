import {Observable} from 'rxjs-es';
import Group from './Xvent.group';
import {touchType} from '../config/touchType.config'
export default class Xvent {
	constructor() {
		this.groupAdvisor = {};
	}

	createGroup(name, stream) {
		if (stream) {
			return this.getGroup(name).mergeStream(stream);
		} else {
			return this.getGroup(name)
		}
	}

	mergeStream(name, stream) {
		return this.getGroup(name).mergeStream(stream);
	}

	getGroup(name) {
		if (this.groupAdvisor[name]) {
			return this.groupAdvisor[name];
		}
		else {
			return this.groupAdvisor[name] = new Group(name, Observable.create(observer => {
			}));
		}
	}

	stream(name) {
		return this.getGroup(name).getStream();
	}

	on(type, dom, data) {
		return Observable.fromEventPattern(
			(next) => {
				if (touchType.indexOf(type) !== -1) {

				} else {
					dom.addEventListener(type, event => {
						next(
							{
								type,
								data,
							}
						)
					})
				}
			},
			(error) => {
			}
		)
	}

}
