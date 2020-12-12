import React, {useEffect, useMemo, useRef, useState} from 'react';
import './styles.css';

function Presentation(props) {
  const [currentPres, setCurrentPres] = useState();

  const owner = useMemo(
    () => props.drawingsList[props.current].playerName === props.userName,
    [props],
  );

  const containerRef = useRef(null);

  useEffect(() => {
    containerRef.current.classList.add('displayed');
    setCurrentPres(containerRef.current);
  }, []);

  useEffect(() => {
    if (currentPres) {
      switch (props.stage) {
        case 'title':
          currentPres.querySelector('.presentation-name').classList.add('show');
          break;
        case 'drawing':
          currentPres.querySelector('.presentation-name').classList.add('show');
          currentPres
            .querySelector('.presentation-drawing')
            .classList.add('show');
          break;
        default:
          currentPres
            .querySelector('.presentation-name')
            .classList.remove('show');
          currentPres
            .querySelector('.presentation-drawing')
            .classList.remove('show');

          break;
      }
    }
  }, [props.stage, currentPres]);

  function changeStage() {
    if (props.drawingsList[props.current].playerName === props.userName) {
      props.changePres();
    }
  }

  return (
    <div
      id="presentation-container"
      className="presentation-container"
      onClick={changeStage}
      ref={containerRef}
    >
      {!owner ? (
        <h5>{props.drawingsList[props.current].playerName} is presenting...</h5>
      ) : (
        <h5>You are presenting. Click anywhere to continue.</h5>
      )}
      <h2 className="presentation-player">
        {props.drawingsList[props.current].playerName}
      </h2>
      <h3 className="presentation-player">
        {props.drawingsList[props.current].problem}
      </h3>
      <h3 className="presentation-name">
        {props.drawingsList[props.current].name}
      </h3>
      <img
        className="presentation-drawing"
        aria-label="presentation-drawing"
        src={props.drawingsList[props.current].url}
        alt=""
      ></img>
    </div>
  );
}

export default Presentation;
