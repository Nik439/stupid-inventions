import {render, screen} from '@testing-library/react';
import ResultsComponent from '../components/ResultsComponent';

describe('ResultsComponent', () => {
  test('should render "winner" singular or plural depending on # of winners', () => {
    let winners = ['test'];
    const board = [{name: '', votes: 3}];

    const {rerender} = render(
      <ResultsComponent winners={winners} leaderboard={board} />,
    );

    expect(screen.getByText('Winner')).toBeInTheDocument();
    expect(screen.queryByText('Winners')).not.toBe();

    winners = ['test', 'test2'];
    rerender(<ResultsComponent winners={winners} leaderboard={board} />);

    expect(screen.getByText('Winners')).toBeInTheDocument();
    expect(screen.queryByText('Winner')).not.toBe();
  });

  test('should render winners', () => {
    let winners = ['test'];
    const board = [{name: '', votes: 3}];

    const {rerender} = render(
      <ResultsComponent winners={winners} leaderboard={board} />,
    );

    expect(screen.getByText('test')).toBeInTheDocument();

    winners = ['test', 'test2'];
    rerender(<ResultsComponent winners={winners} leaderboard={board} />);

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('test2')).toBeInTheDocument();
  });

  test('should render the leaderboard', () => {
    const winners = [''];
    const board = [
      {name: 'test', votes: 3},
      {name: 'test2', votes: 2},
    ];

    render(<ResultsComponent winners={winners} leaderboard={board} />);

    expect(screen.queryAllByTestId('row')).toMatchSnapshot();
  });
});
