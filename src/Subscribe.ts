import * as React from 'react';

import { Service, ServiceType, getBitMaskForServices } from './Service';
import { RServiceContext, ContextValue } from './utils';

export interface SubscribeProps {
  to: ServiceType[];
  render?: (...instances: Service[]) => React.ReactNode;
  children?: (...instances: Service[]) => React.ReactNode;
}

/**
 * Subscribe component acts as a connection to the Provider services
 * It will look for services specified on `to` in the Provider and create them if they don't exist
 */
export class Subscribe extends React.PureComponent<SubscribeProps> {
  instances: Service<any>[] = [];
  prevTo?: ServiceType[];
  /**
   * React 16.3 context has children as a function
   * This function is called with the current
   */
  renderChild = ({ services, init, update }: ContextValue) => {
    //check if `to` changed and create instances if needed
    if (this.props.to !== this.prevTo) {
      this.prevTo = this.props.to;
      this.instances = this.props.to.map(serviceType => {
        let instance = services.get(serviceType);
        if (!instance) {
          instance = Service.create(serviceType, init);
          services.set(serviceType, instance);
        }
        instance.update = update;
        return instance;
      });
    }

    return this.props.render
      ? this.props.render(...this.instances)
      : typeof this.props.children === 'function'
        ? this.props.children(...this.instances)
        : this.props.children;
  };

  render() {
    return React.createElement(RServiceContext.Consumer, {
      unstable_observedBits: getBitMaskForServices(this.props.to),
      children: this.renderChild
    });
  }
}
