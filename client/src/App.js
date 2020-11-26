import React, {useRef} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import Game from './components/Game';

function App() {
  const ref = useRef(null);

  function toggleModal() {
    ref.current.classList.toggle('main-modal-active');
  }

  return (
    <div className="main-container">
      <img
        className="main-home-button"
        src="images/home_icon.svg"
        alt="home button"
        onClick={toggleModal}
      ></img>
      <div id="modal" ref={ref} className="main-modal">
        <p className="main-modal-text">
          Are you sure you want to return to the home page?
        </p>
        <div className="main-modal-button-container">
          <a className="main-modal-button" href="/">
            YES
          </a>
          <p className="main-modal-button" onClick={toggleModal}>
            NO
          </p>
        </div>
      </div>
      <Router>
        <Game />
      </Router>
    </div>
  );
}

export default App;
