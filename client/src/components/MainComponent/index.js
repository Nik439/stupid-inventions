import {useLocalStorage} from '@rehooks/local-storage';
import React, {useEffect, useState} from 'react';
import socketIOClient from 'socket.io-client';
import config from '../../config';
import Drawing from '../stages/Drawing';
import Home from '../stages/Home';
import Lobby from '../stages/Lobby';
import Presentation from '../stages/Presentation';
import Problem from '../stages/Problem';
import Results from '../stages/Results';
import Vote from '../stages/Vote';
import Wait from '../stages/Wait';
import './styles.css';

const ENDPOINT = config.endpoint;

const socket = socketIOClient(ENDPOINT);

function Main() {
  const [gamePhase, setGamePhase] = useState('home');
  const [userName, setUser] = useLocalStorage('name', '');
  const [homeError, setHomeError] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setHost] = useState(false);
  const [playersList, setPlayersList] = useState([]);
  const [problem, setProblem] = useState('');
  const [drawingsList, setDrawingsList] = useState([]);
  const [stage, setStage] = useState('start');
  const [current, setCurrent] = useState(0);
  const [winners, setWinners] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    socket.on('roomDoesntExist', () => {
      setHomeError("Room doesn't exist");
    });
    socket.on('nameAlreadyExists', () => {
      setHomeError('Player name already taken');
    });
    socket.on('joinRoom', (room, hosting) => {
      setHost(hosting);
      setRoomCode(room);
      setGamePhase('lobby');
    });
    socket.on('players', data => {
      setPlayersList(data);
    });
    socket.on('start', prob => {
      setProblem(prob);
      setGamePhase('problem');
    });
    socket.on('draw', () => {
      setGamePhase('drawing');
    });
    socket.on('wait', () => {
      setGamePhase('wait');
    });
    socket.on('present', drawings => {
      setDrawingsList(drawings);
      setGamePhase('presentation');
    });
    socket.on('nextStage', () => {
      setStage(stage => {
        switch (stage) {
          case 'start':
            return 'title';
          case 'title':
            return 'drawing';
          case 'drawing':
            return 'start';
          default:
            break;
        }
      });
    });
    socket.on('nextPres', () => {
      setCurrent(current => {
        return current + 1;
      });
    });
    socket.on('vote', () => {
      setGamePhase('vote');
    });
    socket.on('roundEnd', (winners, leaderboard) => {
      setWinners(winners);
      setLeaderboard(leaderboard);
      setGamePhase('results');
    });
  }, []);

  function hostGame(name) {
    setUser(name);
    socket.emit('host', name);
  }

  function joinGame(roomCode, name) {
    setUser(name);
    socket.emit('join', roomCode, name);
  }

  function startGame() {
    if (isHost) socket.emit('start', roomCode);
  }

  function submitProblemInput(problemInput) {
    socket.emit('problemSubmit', problemInput, userName, roomCode);
  }

  function submitInvention(drwProps) {
    socket.emit('drwSubmit', drwProps, roomCode);
  }

  function changePres() {
    if (stage === 'drawing') {
      if (current + 1 < drawingsList.length) {
        socket.emit('nextStage', roomCode);
        socket.emit('nextPres', roomCode);
      } else {
        socket.emit('donePresenting', roomCode);
      }
    } else if (stage === 'title' || stage === 'start') {
      socket.emit('nextStage', roomCode);
    }
  }

  function submitVote(name) {
    socket.emit('voteSubmit', name, roomCode);
  }

  function doneVoting() {
    socket.emit('doneVoting', userName, roomCode);
  }

  const Game = () => {
    switch (gamePhase) {
      case 'home':
        return (
          <Home
            name={userName}
            homeError={homeError}
            hostGame={hostGame}
            joinGame={joinGame}
          />
        );
      case 'lobby':
        return (
          <Lobby
            isHost={isHost}
            startGame={startGame}
            playersList={playersList}
            room={roomCode}
          />
        );
      case 'wait':
        return <Wait />;
      case 'problem':
        return (
          <Problem problem={problem} submitProblemInput={submitProblemInput} />
        );
      case 'drawing':
        return <Drawing submitInvention={submitInvention} />;
      case 'presentation':
        return (
          <Presentation
            userName={userName}
            drawingsList={drawingsList}
            current={current}
            stage={stage}
            changePres={changePres}
          />
        );
      case 'vote':
        return (
          <Vote
            userName={userName}
            drawingsList={drawingsList}
            submitVote={submitVote}
            doneVoting={doneVoting}
          />
        );
      case 'results':
        return <Results winners={winners} leaderboard={leaderboard} />;
      default:
        return <h1>error</h1>;
    }
  };

  function toggleModal() {
    document.getElementById('modal').classList.toggle('main-modal-active');
  }

  return (
    <div className="main-container">
      <img
        className="main-home-button"
        src="images/home_icon.svg"
        alt="home button"
        onClick={toggleModal}
      ></img>
      <div id="modal" className="main-modal">
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
      <Game />
    </div>
  );
}

export default Main;