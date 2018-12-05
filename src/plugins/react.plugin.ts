import { Component } from 'react';
import { Updator, pipe, ExtendedFunc, ArbitraryFunc } from '../core/store';

function isExtendedFn<T>(fn: any): fn is ExtendedFunc<ArbitraryFunc, T> {
  return typeof fn.addReader === 'function';
}

export default function connectWithComponent<
  Description,
  Field extends keyof Description
>(comp: Component, updator: Updator<Description>, fields?: Field[]) {
  const keys = fields ? fields : (Object.keys(updator) as Field[]);
  for (const key of keys) {
    const fn = updator[key];
    if (isExtendedFn(fn)) {
      pipe(
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
