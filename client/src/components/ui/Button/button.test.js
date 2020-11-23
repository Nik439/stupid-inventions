import {fireEvent, render, screen} from '@testing-library/react';
import Button from './';

describe('Button', () => {
  test('should render value as text', () => {
    render(<Button value="test" />);

    expect(screen.getByText('test')).toBeInTheDocument();
  });

  test('should pass html button props', () => {
    const onClick = jest.fn();

    const {rerender} = render(<Button data-testid="t" onClick={onClick} />);

    fireEvent.click(screen.getByTestId('t'));

    expect(onClick).toBeCalled();

    rerender(<Button data-testid="t" disabled />);

    expect(screen.getByTestId('t').closest('button')).toHaveAttribute(
      'disabled',
    );
  });
});
