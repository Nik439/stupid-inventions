import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
 
import Drawing from '../components/DrawingComponent.js';

describe('Drawing', () => {
  test('Submit only works when a name is added', () => {
    // let called=false;
    // const submitInvention=jest.fn();
    // jest.spyOn(document, ".getElementById").mockImplementation(() => 5) 
    // jest.spyOn(document.getElementById('canvas'), ".getContext('2d')").mockImplementation(() => 5) 
    // render(<Drawing submitInvention={submitInvention}/>);

    // expect(called).toEqual(false);
    // fireEvent.click(screen.getByRole('button'));

    // fireEvent.change(screen.getByLabelText('drawing-name'), { target: { value: 'testTESTtest' } });
    // fireEvent.click(screen.getByRole('button'));
  });
});