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

const Counter = () => {
  const counter = useService(MyService);
  return (
    <div>
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
});
