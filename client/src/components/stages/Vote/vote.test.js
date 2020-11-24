import {fireEvent, render, screen} from '@testing-library/react';
import Vote from '.';
import React from 'react';

const drawing = {playerName: 'a', name: 'test', url: ''};

describe('Vote', () => {
  test('should render the correct amount of coins', () => {
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
    render(
      <Vote
        drawingsList={[drawing]}
        submitVote={() => {}}
        doneVoting={() => {}}
        userName="a"
      />,
    );

    expect(screen.queryByAltText(`a's drawing`)).toBeNull();
  });

  test('should render oponent images', () => {
    render(
      <Vote
        drawingsList={[drawing]}
        submitVote={() => {}}
        doneVoting={() => {}}
        userName="b"
      />,
    );

    expect(screen.queryAllByTestId('drawing')).toMatchSnapshot();
  });
});
