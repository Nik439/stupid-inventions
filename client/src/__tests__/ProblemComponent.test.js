import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
 
import Problem from '../components/ProblemComponent.js';

describe('Problem', () => {
  test('Renders sample problem', () => {
    const problem='sample problem';

    render(<Problem 
      problem={problem}
    />);

    expect(screen.getByText('sample problem')).toBeInTheDocument();
  });

  test('Submits problem only when there has been text input', () => {
    const problem='sample problem';
    const submitProblemInput = jest.fn();

    render(<Problem 
      problem={problem}
      submitProblemInput={submitProblemInput}
    />);
    expect(submitProblemInput).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button'));
    expect(submitProblemInput).not.toHaveBeenCalled();
    
    expect(submitProblemInput).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('problem-input'), { target: { value: 'testTESTtest' } });
    fireEvent.click(screen.getByRole('button'));
    expect(submitProblemInput).toHaveBeenCalled();
  });
});