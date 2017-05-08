export default class Group {
    constructor(groupName, stream) {
        this.groupName = groupName;
        this.stream = stream;
    }
    mergeStream(stream) {
        this.setStream(this.stream.merge(stream));
        return this;
    }
    setStream(stream) {
        this.stream = stream;
        return this;
    }
    getStream() {
        return this.stream;
    }
}
