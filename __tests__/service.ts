import { Service, defaultServiceContext, ServiceInit } from '../src';

class Toggler extends Service<{ on: boolean }, { on: boolean }> {
  static serviceName = 'TogglerService';
  constructor(init: ServiceInit, { on }: { on: boolean } = { on: false }) {
    super(init);
    this.state = {
      on,
    };
  }
  toggle = () => this.setState({ on: !this.state.on });
}

describe('Service', () => {
  it('serviceName and serviceType matches on defaultServiceContext.get', () => {
    const toggler = defaultServiceContext.get(Toggler);

    // @ts-ignore
    expect(toggler.$name).toBe(Toggler.serviceName);
    // @ts-ignore
    expect(toggler.$name).toBe('TogglerService');
    expect(toggler).toBeInstanceOf(Toggler);
  });

  it('changes the state when setState is called', () => {
    const toggler = defaultServiceContext.get(Toggler);

    expect(toggler.state.on).toBe(false);
    toggler.toggle();
    expect(toggler.state.on).toBe(true);
  });

  it('creates a Service with a different key', () => {
    const toggler = defaultServiceContext.get(Toggler, 'foo');

    // @ts-ignore
    expect(toggler.$name).not.toBe(Toggler.serviceName);
    // @ts-ignore
    expect(toggler.$name).toBe('TogglerService_foo');
  });

  it('creates a Service with parameters', () => {
    const toggler = defaultServiceContext.get(Toggler, null, { on: true });

    expect(toggler.state.on).toBe(true);
  });
});
