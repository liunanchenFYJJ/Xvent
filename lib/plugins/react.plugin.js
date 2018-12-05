'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const store_1 = require('../core/store');
function isExtendedFn(fn) {
  return typeof fn.addReader === 'function';
}
function connectWithComponent(comp, updator, fields) {
  const keys = fields ? fields : Object.keys(updator);
  for (const key of keys) {
    const fn = updator[key];
    if (isExtendedFn(fn)) {
      store_1.pipe(
        fn,
        () => {
          comp.setState({
            /* just quene update */
          });
        }
      );
    }
  }
}
exports.default = connectWithComponent;
