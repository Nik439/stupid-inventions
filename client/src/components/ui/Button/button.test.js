import {fireEvent, render, screen} from '@testing-library/react';
import Button from './';
import React from 'react';

const testid = 'test';

describe('Button', () => {
  test('should render value as text', () => {
    render(<Button value={testid} />);

    expect(screen.getByText(testid)).toBeInTheDocument();
  });

  test('should pass html button props', () => {
    const onClick = jest.fn();

    const {rerender} = render(
      <Button data-testid={testid} onClick={onClick} />,
    );

    fireEvent.click(screen.getByTestId(testid));

    expect(onClick).toBeCalled();

    rerender(<Button data-testid={testid} disabled />);

    expect(screen.getByTestId(testid).closest('button')).toHaveAttribute(
      'disabled',
    );
  });
});
