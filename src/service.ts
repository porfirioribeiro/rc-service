/* eslint-disable no-dupe-class-members,no-underscore-dangle */
import { ServiceListener, Mutable, ServiceCtx } from './types';
import { batch } from './batch';

export interface ServiceInit {
  /** @see Service.$ctx */
  $ctx: ServiceCtx;
  /** @see Service.$key */
  $key?: string | null;
  /** @see Service.$ctx */
  $name: string;
}

export abstract class Service<State, InitOptions = any> {
  /** state of this Service */
  state: State;
  /** optional key to allow multiple instances of the same service */
  protected readonly $key?: string | null;
  /** the name of this service in the ServiceContext ($ctx) */
  protected readonly $name: string;
  /** The ServiceContext this Service belongs */
  protected readonly $ctx: ServiceCtx;

  private _listeners: ServiceListener<any>[];
  private _stop?(): void;

  /**
   * Optional callback that will be called when this Service is disposed on the ServiceContext
   * @see ServiceCtx.dispose
   */
  protected $onDispose?(): void;

  /**
   * Optional callback that will be called the first time this Service is subscribed on the ServiceContext
   * It may return a function that will be called when the last subscriber unsubscribe
   * @see autoDispose
   */
  protected $onLifecycle?(): () => void;

  // @ts-ignore options might be used by implementations
  constructor(init: ServiceInit, options?: InitOptions) {
    this._listeners = [];
    this.$key = init.$key;
    this.$name = init.$name;
    this.$ctx = init.$ctx;
    // Object.assign(this,init)
    this.state = {} as State;
  }

  /**
   * Set's the internal state of this Service and notify all the subscribers to update
   * @param newState Partial state to shallow merge with the current state
   */
  protected setState(newState: Partial<State>): void;
  /**
   * Set's the internal state of this Service and notify all the subscribers to update
   * @param newState Full state that replaces the state with the new state
   * @param o options to pass
   * @param {true} o.full full replace
   * @param {boolean} o.silent do not notify the subscribers
   * @param {boolean} o.queue execute the notification on queueMicrotask
   */
  protected setState(newState: State, o: { full: true; silent?: boolean; queue?: boolean }): void;
  /**
   * Set's the internal state of this Service and notify all the subscribers to update
   * @param newState Partial state to merge with the current state
   * @param o options to pass
   * @param {false|undefined} o.full full replace
   * @param {boolean} o.silent do not notify the subscribers
   * @param {boolean} o.queue execute the notification on queueMicrotask
   */
  protected setState(newState: Partial<State>, o: { full?: false; silent?: boolean; queue?: boolean }): void;
  protected setState(newState: State, { full, silent, queue }: { full?: boolean; silent?: boolean; queue?: boolean } = {}) {
    const state = full ? newState : Object.assign({}, this.state, newState);
    (this as Mutable<Service<State>>).state = state;
    if (!silent) {
      const callback = () =>
        batch(listeners => {
          for (let i = 0; i < listeners.length; i += 1) {
            listeners[i](state);
          }
        }, this._listeners);
      if (queue) queueMicrotask(callback);
      else callback();
    }
  }

  /**
   * Subscribe to this service, the listener will be called on every change (setState)
   * Returns a function that will unsubscribe the Service
   */
  subscribe(listener: ServiceListener<State>) {
    this._listeners.push(listener);
    if (this.$onLifecycle && this._listeners.length === 1) this._stop = this.$onLifecycle();
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
      if (this._stop && !this._listeners.length) {
        this._stop();
        this._stop = undefined;
      }
    };
  }
}
