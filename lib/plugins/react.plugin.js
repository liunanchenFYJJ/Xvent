'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const react_1 = require('react');
class StoredComponent extends react_1.Component {
  constructor(props, storeCreator) {
    super(props);
    const { updator, snapshot } = storeCreator();
    this.updator = updator;
    this.snapshot = snapshot;
  }
}
exports.default = StoredComponent;
