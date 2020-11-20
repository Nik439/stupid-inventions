import React, {useEffect, useState} from 'react';
import '../component-styles/PresentationComponent.css';

function Presentation(props) {
  const [currentPres, setCurrentPres] = useState();

  useEffect(() => {
    let current = document.querySelector('.presentation-container');
    current.classList.add('displayed');
    setCurrentPres(current);
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
     >
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
        src={props.drawingsList[props.current].url} 
        alt="">
      </img>
    </div>
  );
}

export default Presentation;
