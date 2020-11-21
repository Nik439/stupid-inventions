import {render, screen} from '@testing-library/react';
import WaitComponent from '../WaitComponent';

describe('WaitComponent', () => {
  test('should render waiting message', () => {
    render(<WaitComponent />);

    expect(screen.getByTestId('h1')).toMatchSnapshot();
  });
});
