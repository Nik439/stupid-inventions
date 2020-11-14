import React, { useState, useEffect } from 'react';

function Presentation(props) {
  const [currentPres, setCurrentPres] = useState();

  useEffect (() => {
    let current = document.querySelector('.pres-container')
    current.classList.add('displayed');
    setCurrentPres(current);
  },[]);

  useEffect(() => {
    if (currentPres) {
      switch (props.stage) {
        case 1:
          currentPres.querySelector('.pres-name').classList.add('show');
          break;
        case 2:
          currentPres.querySelector('.pres-name').classList.add('show');
          currentPres.querySelector('.pres-drawing').classList.add('show');
          break; 
        default:
          break;
      }
    }
    
  }, [props.stage, currentPres]);

  function changeStage () {
    if (props.drawingsList[props.current].playerName === props.userName) {
      props.changePres();
    }
  }

  return (
    <div id="presentation" className="presentation" onClick={changeStage}>
      <div className="pres-container">
        <h2 className="pres-player">{props.drawingsList[props.current].playerName}</h2>
        <h3 className="pres-player">{props.drawingsList[props.current].problem}</h3>
        <h3 className="pres-name">{props.drawingsList[props.current].name}</h3>
        <img className="pres-drawing" src={props.drawingsList[props.current].url} alt=""></img>
      </div>
    </div>
  );
}

export default Presentation;