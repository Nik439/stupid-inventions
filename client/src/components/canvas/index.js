import {useEffect, useRef, useState} from 'react';
import './styles.css';

function Canvas({refProp}) {
  const [context, setContext] = useState(null);
  const [painting, setPainting] = useState(false);
  const [originalDiff, setOriginalDiff] = useState(1);

  const [clickX, setClickX] = useState([]);
  const [clickY, setClickY] = useState([]);
  const [clickDrag, setClickDrag] = useState([]);

  const colors = {
    black: useRef(null),
    red: useRef(null),
    green: useRef(null),
    blue: useRef(null),
  };

  const [activeColor, setActiveColor] = useState(colors.black);

  // const ref = useRef(null);

  useEffect(() => {
    const canvas = refProp.current;
    const ctx = canvas.getContext('2d');

    ctx.lineJoin = 'round';
    ctx.lineWidth = 5;

    setContext(() => ctx);
    setOriginalDiff(() => 500 / canvas.offsetWidth);
  }, []);

  const addClick = (x, y, dragging) => {
    setClickX([...clickX, x * originalDiff]);
    setClickY([...clickY, y * originalDiff]);
    setClickDrag([...clickDrag, dragging]);
  };

  const draw = () => {
    let i = clickX.length - 1;

    context.beginPath();

    if (clickDrag[i] && i) {
      context.moveTo(clickX[i - 1], clickY[i - 1]);
    } else {
      context.moveTo(clickX[i] - 1, clickY[i]);
    }

    context.lineTo(clickX[i], clickY[i]);
    context.closePath();
    context.stroke();
  };

  const onMouseDown = e => {
    setPainting(true);

    addClick(
      e.pageX - refProp.current.offsetLeft,
      e.pageY - refProp.current.offsetTop,
      false,
    );

    draw();
  };

  const onTouchStart = e => {
    setPainting(true);

    addClick(
      e.touches[0].pageX - refProp.current.offsetLeft,
      e.touches[0].pageY - refProp.current.offsetTop,
    );

    draw();
  };

  const onMouseMove = e => {
    if (painting) {
      addClick(
        e.pageX - refProp.current.offsetLeft,
        e.pageY - refProp.current.offsetTop,
        true,
      );

      draw();
    }
  };

  const onTouchMove = e => {
    e.preventDefault();

    if (painting) {
      addClick(
        e.touches[0].pageX - refProp.current.offsetLeft,
        e.touches[0].pageY - refProp.current.offsetTop,
        true,
      );

      draw();
    }
  };

  const onMouseUpLeave = () => {
    setPainting(false);
  };

  const changeColor = color => {
    activeColor.current.classList.remove('active-color');

    setContext(Object.assign(context, {strokeStyle: color}));

    colors[color].current.classList.add('active-color');
    setActiveColor(colors[color]);
  };

  return (
    <div className="drawing-space">
      <canvas
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        onMouseUp={onMouseUpLeave}
        onMouseLeave={onMouseUpLeave}
        onTouchEnd={onMouseUpLeave}
        onTouchCancel={onMouseUpLeave}
        style={{backgroundColor: 'white'}}
        width="500"
        height="500"
        ref={refProp}
      ></canvas>
      <div className="drawing-colors">
        <div
          ref={colors.black}
          className="color black active-color"
          onClick={e => changeColor('black')}
        ></div>
        <div
          ref={colors.red}
          className="color red"
          onClick={e => changeColor('red')}
        ></div>
        <div
          ref={colors.green}
          className="color green"
          onClick={e => changeColor('green')}
        ></div>
        <div
          ref={colors.blue}
          className="color blue"
          onClick={e => changeColor('blue')}
        ></div>
      </div>
    </div>
  );
}

export default Canvas;
