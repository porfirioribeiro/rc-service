import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
// this adds custom jest matchers from @testing-library/jest-dom
import '@testing-library/jest-dom';

import { Service, useService } from '../src';

function click(el: HTMLElement) {
  fireEvent(
    el,
    new MouseEvent('click', {
      bubbles: true, // click events must bubble for React to see it
      cancelable: true,
    }),
  );
}

export class MyService extends Service<{ value: number }> {
  static serviceName = 'MyService';
  state = {
    value: 10,
  };
  increment = () => this.setState({ value: this.state.value + 1 });
  decrement = () => this.setState({ value: this.state.value - 1 });
}

const Counter = (p: { name?: string }) => {
  const counter = useService(MyService, p.name);
  return (
    <div data-testid={p.name || 'test'}>
      <span data-testid="value">{counter.state.value}</span>
      <button data-testid="decrement" onClick={() => counter.decrement()}>
        -
      </button>
      <button data-testid="increment" onClick={() => counter.increment()}>
        +
      </button>
    </div>
  );
};

describe('Provider', () => {
  it('does something', () => {
    const p = render(
      <>
        <Counter />
      </>,
    );
    expect(p.getByTestId('value')).toHaveTextContent('10');
    click(p.getByTestId('increment'));
    expect(p.getByTestId('value')).toHaveTextContent('11');
    click(p.getByTestId('decrement'));
    expect(p.getByTestId('value')).toHaveTextContent('10');
  });
  it('Provider with service name', () => {
    const p = render(
      <>
        <Counter name="c1" />
        <Counter name="c2" />
      </>,
    );

    const c1 = getElems(p.getByTestId('c1'));
    const c2 = getElems(p.getByTestId('c2'));

    expect(c1.value).toHaveTextContent('10');
    click(c1.increment);
    expect(c1.value).toHaveTextContent('11');
    click(c1.decrement);
    expect(c1.value).toHaveTextContent('10');

    expect(c2.value).toHaveTextContent('10');
    click(c2.increment);
    click(c2.increment);
    expect(c2.value).toHaveTextContent('12');
    click(c2.decrement);
    expect(c2.value).toHaveTextContent('11');
  });
});

function getElems(c: HTMLElement) {
  return {
    value: c.querySelector('[data-testid=value]') as HTMLElement,
    increment: c.querySelector('[data-testid=increment]') as HTMLElement,
    decrement: c.querySelector('[data-testid=decrement]') as HTMLElement,
  };
}
