import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import Drawing from '.';
import MyComponent from '../../canvas/index.js';

const MockMyComponent = () => {
  return <div></div>;
};
jest.mock('../../canvas/index.js', () => ({
  __esModule: true,
  namedExport: jest.fn(),
  default: jest.fn(),
}));

beforeAll(() => {
  MyComponent.mockImplementation(MockMyComponent);
});
jest.mock('react', () => {
  const originReact = jest.requireActual('react');
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef,
  };
});
jest.spyOn(React, 'useRef').mockReturnValueOnce({
  current: {
    toDataURL: () => {
      return 5;
    },
  },
});
//none of this makes sense but its the only way to get this to work and jest is really bad so dont touch it

const submitInvention = jest.fn();
describe('Drawing', () => {
  test('pressing submit calls submit only when a invention name has been entered', () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: {
        toDataURL: () => {
          return 5;
        },
      },
    });

    render(<Drawing submitInvention={submitInvention} />);

    expect(submitInvention).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button'));
    expect(submitInvention).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole('textbox'), {
      target: {value: 'ASS'},
    });
    expect(screen.getByRole('textbox')).toHaveValue('ASS');
    fireEvent.click(screen.getByRole('button'));
    expect(submitInvention).toHaveBeenCalled();
  });
});
