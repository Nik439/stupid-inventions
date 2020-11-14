import React, { useState, useEffect, useRef } from 'react';

function Drawing (props) {
  const [drawingName, setDrawingName] = useState('');
  const [nameCount, setNameCount] = useState(0);
  const [context, setContext] = useState({});
  const [paint, setPaint] = useState(false);
  const [click, setClick] = useState({
    x: [],
    y: [],
    drag: []
  });
  const [orignialDiff, setDiff] = useState(1);
  const contextRef = useRef({});
  contextRef.current = context;

  useEffect(() => {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5;

    setContext(ctx);
    setDiff(500 / document.getElementById('canvas').offsetWidth);

    document.getElementById('canvas').addEventListener('mousedown', onMouseDown);

    document.getElementById('canvas').addEventListener('mousemove', onMouseMove);

    document.getElementById('canvas').addEventListener('mouseup', onMouseUpLeave);

    document.getElementById('canvas').addEventListener('mouseleave', onMouseUpLeave);

    window.addEventListener('resize', onResize);

    return (() => { //Unmount
      document.getElementById('canvas').removeEventListener('mousedown', onMouseDown);

      document.getElementById('canvas').removeEventListener('mousemove', onMouseMove);

      document.getElementById('canvas').removeEventListener('mouseup', onMouseUpLeave);

      document.getElementById('canvas').removeEventListener('mouseleave', onMouseUpLeave);

      window.removeEventListener('resize', onResize);
    });
  });

  function onMouseDown (e) {
    setPaint(true);
    addClick(e.pageX - document.getElementById('canvas').offsetLeft, e.pageY - document.getElementById('canvas').offsetTop, false);
    draw();
  }

  function onMouseMove (e) {
    if (paint) {
      addClick(e.pageX - document.getElementById('canvas').offsetLeft, e.pageY - document.getElementById('canvas').offsetTop, true);
      draw();
    }
  }

  function onMouseUpLeave () {
    setPaint(false);
  }

  function onResize () {
    setDiff(500 / document.getElementById('canvas').offsetWidth);
  }

  function addClick (addX, addY, dragging) {
    setClick( prevState => {
      return ({
        x: [...prevState.x, addX*orignialDiff],
        y: [...prevState.y, addY*orignialDiff],
        drag: [...prevState.drag, dragging],
      });
    });
  }

  function changeColor (color, e) {
    setContext( prevState => Object.assign(prevState.context, {strokeStyle: color}));
    document.querySelector('.active-color').classList.remove('active-color');
    e.target.classList.add('active-color');
  }

  function draw () {
    let i = click.x.length-1;        	
    contextRef.current.beginPath();
    if (click.drag[i] && i) {
      context.moveTo(click.x[i-1], click.y[i-1]);
    } else {
      contextRef.current.moveTo(click.x[i]-1, click.y[i]);
    }
    contextRef.current.lineTo(click.x[i], click.y[i]);
    contextRef.current.closePath();
    contextRef.current.stroke();
  }

  function handleSubmit () {
    let url = document.getElementById('canvas').toDataURL('image/png');
    let drwProps = {
      name: drawingName,
      url: url
    };
    props.submitInvention(drwProps);
  }

  return (
    <div className='drawing'>
      <div className='drawing-container'>
        <label htmlFor='name' className='drawing-label'>Invention Name</label>
        <div className='drawing-inputs'>
          <label className='drawing-name-count'>{nameCount}/50</label>
          <input name='name' className='drawing-name' maxLength='50' onChange={e=>{setDrawingName(e.target.value); setNameCount(e.target.value.lenght);}} autoComplete='off' type='text' placeholder=''></input>
          <input className='drawing-submit' onClick={handleSubmit} type='button' value='SUBMIT'></input>
        </div>
        <div className='drawing-space'>
          <canvas id='canvas' className='canvas' width='500' height='500'></canvas>
          <div className='drawing-colors'>
            <div className='color black active-color' onClick={(e) => changeColor('#000', e)}></div>
            <div className='color red' onClick={(e) => changeColor('#df4b26', e)}></div>
            <div className='color green' onClick={(e) => changeColor('#228622' ,e)}></div>
            <div className='color blue' onClick={(e) => changeColor('#3a68cc', e)}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Drawing;
