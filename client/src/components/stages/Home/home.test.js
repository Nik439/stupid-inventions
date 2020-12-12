import {fireEvent, render, screen} from '@testing-library/react';
import React from 'react';
import Home from '.';

const userName = 'userName';
const homeError = 'homeError';
const hostGame = jest.fn();
const joinGame = jest.fn();

describe('Home', () => {
  test('Renders error message if present', () => {
    render(<Home name={userName} homeError={homeError} />);

    expect(screen.getByText('homeError')).toBeInTheDocument();
  });

  test('Calls props.hostGame when host button is pressed', () => {
    render(<Home name={userName} homeError={homeError} hostGame={hostGame} />);

    expect(hostGame).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('HOST GAME'));
    expect(hostGame).toHaveBeenCalled();
  });

  test('Calls props.joinGame when host button is pressed', () => {
    render(<Home name={userName} homeError={homeError} joinGame={joinGame} />);
    expect(joinGame).not.toHaveBeenCalled();
    fireEvent.change(screen.getByPlaceholderText('ENTER NAME'), {
      target: {value: 'TEST'},
    });
    fireEvent.change(screen.getByPlaceholderText('INSERT CODE'), {
      target: {value: 'ASS'},
    });
    fireEvent.click(screen.getByText('JOIN GAME'));
    expect(joinGame).toHaveBeenCalled();
  });
});
