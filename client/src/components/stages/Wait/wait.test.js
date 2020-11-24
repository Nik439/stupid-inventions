import {render, screen} from '@testing-library/react';
import Wait from '.';
import React from 'react';

describe('Wait', () => {
  test('should render waiting message', () => {
    render(<Wait />);

    expect(screen.getByTestId('h1')).toMatchSnapshot();
  });
});
