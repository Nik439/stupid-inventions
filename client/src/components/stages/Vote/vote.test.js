import {fireEvent, render, screen} from '@testing-library/react';
import Vote from '.';

describe('Vote', () => {
  test('should render the correct amount of coins', () => {
    const drawing = {playerName: 'a', name: 'test', url: ''};

    render(
      <Vote
        drawingsList={[drawing]}
        submitVote={() => {}}
        doneVoting={() => {}}
        userName="b"
      />,
    );

    expect(screen.getAllByTestId('coin').length).toBe(3);
    fireEvent.click(screen.getByTestId('drawing'));
    expect(screen.getAllByTestId('coin').length).toBe(2);
    fireEvent.click(screen.getByTestId('drawing'));
    expect(screen.getAllByTestId('coin').length).toBe(1);
    fireEvent.click(screen.getByTestId('drawing'));
    expect(screen.queryByTestId('coin')).toBeNull();
  });

  test('should not display user image', () => {
    const playerName = 'a';
    const drawing = {playerName, name: 'test', url: ''};

    render(
      <Vote
        drawingsList={[drawing]}
        submitVote={() => {}}
        doneVoting={() => {}}
        userName="a"
      />,
    );

    expect(screen.queryByAltText(`${playerName}'s drawing`)).toBeNull();
  });

  test('should render oponent images', () => {
    const drawing = {playerName: 'b', name: 'test', url: ''};

    render(
      <Vote
        drawingsList={[drawing]}
        submitVote={() => {}}
        doneVoting={() => {}}
        userName="a"
      />,
    );

    expect(screen.queryAllByTestId('drawing')).toMatchSnapshot();
  });
});
