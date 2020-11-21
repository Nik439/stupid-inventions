import {fireEvent, render, screen} from '@testing-library/react';
import React from 'react';
import Home from '../HomeComponent.js';

describe('Home', () => {
  test('Renders error message if present', () => {
    const userName = 'userName';
    const homeError = 'homeError';

    render(<Home name={userName} homeError={homeError} />);

    expect(screen.getByText('homeError')).toBeInTheDocument();
  });

  test('Calls props.hostGame when host button is pressed', () => {
    const userName = 'userName';
    const homeError = 'homeError';
    const hostGame = jest.fn();

    render(<Home name={userName} homeError={homeError} hostGame={hostGame} />);

    expect(hostGame).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('HOST GAME'));
    expect(hostGame).toHaveBeenCalled();
  });

  test('Calls props.joinGame when host button is pressed', () => {
    const userName = 'userName';
    const homeError = 'homeError';
    const joinGame = jest.fn();

    render(<Home name={userName} homeError={homeError} joinGame={joinGame} />);
    expect(joinGame).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('JOIN GAME'));
    expect(joinGame).toHaveBeenCalled();
  });
});
