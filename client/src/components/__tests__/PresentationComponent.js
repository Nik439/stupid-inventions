import {render, screen} from '@testing-library/react';
import React from 'react';
import Presentation from '../PresentationComponent.js';

describe('Presentation', () => {
  test('Renders the', () => {
    const userName = 'username';
    const drawingsList = [
      {
        name: 'Invention Name',
        problem: 'Problem name',
        playerName: 'user',
        url: 'images/logo.svg',
      },
    ];
    const current = 0;
    const stage = 'start';
    const changePres = jest.fn();

    render(
      <Presentation
        userName={userName}
        drawingsList={drawingsList}
        current={current}
        stage={stage}
        changePres={changePres}
      />,
    );

    expect(screen.getByText('user')).toBeInTheDocument();
    expect(screen.getByText('Problem name')).toBeInTheDocument();
    expect(screen.getByText('Invention Name')).toBeInTheDocument();
    expect(screen.getByLabelText('presentation-drawing')).toBeInTheDocument();
  });
});
