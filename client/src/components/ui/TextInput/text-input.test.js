import {render, screen} from '@testing-library/react';
import TextInput from './';
import React from 'react';

const testid='t';

describe('TextInput', () => {
  test('should have autoComplete off', () => {
    render(<TextInput data-testid={testid} />);

    expect(screen.getByTestId(testid).closest('input')).toHaveAttribute(
      'autoComplete',
      'off',
    );
  });

  test('should pass input props', () => {
    render(<TextInput data-testid={testid} type="number" />);

    expect(screen.getByTestId(testid).closest('input')).toHaveAttribute(
      'type',
      'number',
    );
  });
});
