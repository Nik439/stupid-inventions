import {fireEvent, render, screen} from '@testing-library/react';
import React from 'react';
import Lobby from '.';

const isHost = true;
const roomCode = 'FRC';
const startGame = jest.fn();

describe('Lobby', () => {
  test('Renders room code', () => {
    const playersList = [];

    render(<Lobby isHost={isHost} playersList={playersList} room={roomCode} />);

    expect(screen.getByText(roomCode)).toBeInTheDocument();
  });

  test('Renders player names', () => {
    const playersList = ['testName1', 'testName2', 'testName3'];

    render(<Lobby isHost={isHost} playersList={playersList} room={roomCode} />);

    expect(screen.getByText('testName1')).toBeInTheDocument();
    expect(screen.getByText('testName2')).toBeInTheDocument();
    expect(screen.getByText('testName3')).toBeInTheDocument();
  });

  test('Start game works when player is host', () => {
    const playersList = ['testName1', 'testName2', 'testName3'];

    render(
      <Lobby
        isHost={isHost}
        playersList={playersList}
        room={roomCode}
        startGame={startGame}
      />,
    );

    expect(startGame).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button'));
    expect(startGame).toHaveBeenCalled();
  });
});
