import {fireEvent, render, screen} from '@testing-library/react';
import React from 'react';
import Problem from '.';

const problem = 'sample problem';

describe('Problem', () => {
  test('Renders sample problem', () => {
    render(<Problem problem={problem} />);

    expect(screen.getByText(problem)).toBeInTheDocument();
  });

  test('Submits problem only when there has been text input', () => {
    const submitProblemInput = jest.fn();

    render(
      <Problem problem={problem} submitProblemInput={submitProblemInput} />,
    );
    expect(submitProblemInput).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button'));
    expect(submitProblemInput).not.toHaveBeenCalled();

    expect(submitProblemInput).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('problem-input'), {
      target: {value: 'testTESTtest'},
    });
    fireEvent.click(screen.getByRole('button'));
    expect(submitProblemInput).toHaveBeenCalled();
  });
});
