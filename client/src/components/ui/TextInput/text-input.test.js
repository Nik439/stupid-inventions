import {render, screen} from '@testing-library/react';
import TextInput from './';

describe('TextInput', () => {
  test('should have autoComplete off', () => {
    render(<TextInput data-testid="t" />);

    expect(screen.getByTestId('t').closest('input')).toHaveAttribute(
      'autoComplete',
      'off',
    );
  });

  test('should pass input props', () => {
    render(<TextInput data-testid="t" type="number" />);

    expect(screen.getByTestId('t').closest('input')).toHaveAttribute(
      'type',
      'number',
    );
  });
});
