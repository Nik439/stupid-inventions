import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useLocalStorage  } from '@rehooks/local-storage';

import Home from './HomeComponent';
import Lobby from './LobbyComponent';
import Problem from './ProblemComponent';
import Drawing from './DrawingComponent';
import Presentation from './PresentationComponent';

const ENDPOINT ='localhost:5000';
const socket = socketIOClient(ENDPOINT);

function Main () {
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

  useEffect(() => {
    socket.on('roomDoesntExist', () => {
      setHomeError('Room doesn\'t exist');
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
    socket.on('present', drawings => {
      setDrawingsList(drawings);
      setGamePhase('presentation');
    });
    socket.on('nextStage', () => {

      setStage (stage => {
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
      setCurrent (current => {
        return current+1;
      });
    });
  }, []);

  function hostGame (name) {
    setUser(name);
    socket.emit('host', name);
  }

  function joinGame (roomCode, name) {
    setUser(name);
    socket.emit('join', roomCode, name);
  }

  function startGame () {
    if (isHost) socket.emit('start', roomCode);
  }

  function submitProblemInput (problemInput) {
    // setGamePhase('wait');
    socket.emit('problemSubmit', problemInput, userName, roomCode);
  }

  function submitInvention (drwProps) {
    // setGamePhase('wait');
    socket.emit('drwSubmit', drwProps, roomCode);
  }

  function changePres () {
    if (stage === 'drawing') {
      if (current+1 < drawingsList.length) {
        socket.emit('nextPres', roomCode);
      } else {
        socket.emit('donePresenting', roomCode);
      }
    }
    socket.emit('nextStage', roomCode);
  }

  const Game = () => {
    switch (gamePhase) {
    case 'home':
      return (
        <Home name={userName} homeError={homeError} hostGame={hostGame} joinGame={joinGame}/>
      );
    case 'lobby':
      return (
        <Lobby isHost={isHost} startGame={startGame} playersList={playersList} room={roomCode}/>
      );
    case 'problem':
      return (
        <Problem problem={problem} submitProblemInput={submitProblemInput} />
      );
    case 'drawing':
      return (
        <Drawing submitInvention={submitInvention}/>
      );
    case 'presentation':
      return (
        <Presentation userName={userName} drawingsList={drawingsList} current={current} stage={stage} changePres={changePres} />
      );
    default:
      return <h1>error</h1>;
    }
  };

  return (
    <div className='container'>
      <Game/>
    </div>
  );
}

export default Main;