import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
 
import Lobby from '../components/LobbyComponent.js';

describe('Lobby', () => {
  test('Renders room code', () => {
    const isHost=true;
    const playersList=[];
    const roomCode='FRC';

    render(<Lobby 
      isHost={isHost}
      playersList={playersList}
      room={roomCode}
    />);

    expect(screen.getByText('FRC')).toBeInTheDocument();
  });

  test('Renders player names', () => {
    const isHost=true;
    const playersList=['testName1','testName2', 'testName3'];
    const roomCode='FRC';

    render(<Lobby 
      isHost={isHost}
      playersList={playersList}
      room={roomCode}
    />);

    expect(screen.getByText('testName1')).toBeInTheDocument();
    expect(screen.getByText('testName2')).toBeInTheDocument();
    expect(screen.getByText('testName3')).toBeInTheDocument();
  });

  test('Start game works when player is host', () => {
    const isHost=true;
    const playersList=['testName1','testName2', 'testName3'];
    const roomCode='FRC';
    const startGame=jest.fn();

    render(<Lobby 
      isHost={isHost}
      playersList={playersList}
      room={roomCode}
      startGame={startGame}
    />);

    expect(startGame).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button'));
    expect(startGame).toHaveBeenCalled();
  });
});