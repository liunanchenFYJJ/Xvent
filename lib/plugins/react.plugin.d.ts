import { Component } from 'react';
import { Updator, Snapshot } from '../core/store';
export interface StoreHelper<Description> {
  updator: Updator<Description>;
  snapshot: Snapshot<Description>;
}
export declare type StoreCreator<Description> = () => StoreHelper<Description>;
export default class StoredComponent<
  Description,
  Prop = {},
  State = {},
  SS = any
> extends Component<Prop, State, SS> {
  protected updator: Updator<Description>;
  protected snapshot: Snapshot<Description>;
  constructor(props: any, storeCreator: StoreCreator<Description>);
}
