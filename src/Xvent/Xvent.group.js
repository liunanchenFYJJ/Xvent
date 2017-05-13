import {Subject} from 'rxjs-es'
export default class Group {
	constructor(groupName, stream) {
		this.groupName = groupName;
		this.stream = stream;
		this.subject = new Subject();
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
		let subject = this.subject;
		subject.subscribe(observer);
		this.getStream().subscribe({
			next(...arg){
				subject.next(...arg)
			},
			error(){
				subject.error()
			},
			complete(){
				subject.complete
			}
		})
	}
}
