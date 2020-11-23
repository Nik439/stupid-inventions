import {render, screen} from '@testing-library/react';
import Results from '.';

describe('Results', () => {
  test('should render "winner" singular or plural depending on # of winners', () => {
    let winners = ['test'];
    const board = [{name: '', votes: 3}];

    const {rerender} = render(
      <Results winners={winners} leaderboard={board} />,
    );

    expect(screen.getByText('Winner')).toBeInTheDocument();
    expect(screen.queryByText('Winners')).not.toBe();

    winners = ['test', 'test2'];
    rerender(<Results winners={winners} leaderboard={board} />);

    expect(screen.getByText('Winners')).toBeInTheDocument();
    expect(screen.queryByText('Winner')).not.toBe();
  });

  test('should render winners', () => {
    let winners = ['test'];
    const board = [{name: '', votes: 3}];

    const {rerender} = render(
      <Results winners={winners} leaderboard={board} />,
    );

    expect(screen.getByText('test')).toBeInTheDocument();

    winners = ['test', 'test2'];
    rerender(<Results winners={winners} leaderboard={board} />);

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('test2')).toBeInTheDocument();
  });

  test('should render the leaderboard', () => {
    const winners = [''];
    const board = [
      {name: 'test', votes: 3},
      {name: 'test2', votes: 2},
    ];

    render(<Results winners={winners} leaderboard={board} />);

    expect(screen.queryAllByTestId('row')).toMatchSnapshot();
  });
});
