import {Subject} from 'rxjs-es'
export default class Group {
	constructor(groupName, stream) {
		this.groupName = groupName;
		this.stream = stream;
	}

	mergeStream(stream) {
		return this.setStream(this.stream.merge(stream));
	}

	setStream(stream) {
		this.stream = stream;
		return this;
	}

	getStream() {
		return this.stream;
	}

	getSubject() {
		return this.subject
	}

	subscribe(observer) {
		this.getStream().subscribe(observer)
	}
}
