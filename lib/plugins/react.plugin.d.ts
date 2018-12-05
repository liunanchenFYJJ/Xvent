import { Component } from 'react';
import { Updator } from '../core/store';
export default function connectWithComponent<
  Description,
  Field extends keyof Description
>(comp: Component, updator: Updator<Description>, fields?: Field[]): void;
