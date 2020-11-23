import {useLocalStorage} from '@rehooks/local-storage';
import React, {useEffect, useState} from 'react';
import {Route, Switch, useHistory} from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import config from '../config';
import Drawing from './stages/Drawing';
import Home from './stages/Home';
import Lobby from './stages/Lobby';
import Presentation from './stages/Presentation';
import Problem from './stages/Problem';
import Results from './stages/Results';
import Vote from './stages/Vote';
import Wait from './stages/Wait';

const ENDPOINT = config.endpoint;

const socket = socketIOClient(ENDPOINT);

const Game = () => {
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

  const history = useHistory();

  useEffect(() => {
    history.push('/');

    socket.on('roomDoesntExist', () => {
      setHomeError("Room doesn't exist");
    });
    socket.on('nameAlreadyExists', () => {
      setHomeError('Player name already taken');
    });
    socket.on('joinRoom', (room, hosting) => {
      setHost(hosting);
      setRoomCode(room);
      history.push('/lobby');
    });
    socket.on('players', data => {
      setPlayersList(data);
    });
    socket.on('start', prob => {
      setProblem(prob);
      history.push('/problem');
    });
    socket.on('draw', () => {
      history.push('/draw');
    });
    socket.on('wait', () => {
      history.push('/wait');
    });
    socket.on('present', drawings => {
      setDrawingsList(drawings);
      history.push('/presentation');
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
      history.push('/vote');
    });
    socket.on('roundEnd', (winners, leaderboard) => {
      setWinners(winners);
      setLeaderboard(leaderboard);
      history.push('/results');
    });
  }, [history]);

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

  return (
    <Switch>
      <Route exact path="/">
        <Home
          name={userName}
          homeError={homeError}
          hostGame={hostGame}
          joinGame={joinGame}
        />
      </Route>
      <Route path="/lobby">
        <Lobby
          isHost={isHost}
          startGame={startGame}
          playersList={playersList}
          room={roomCode}
        />
      </Route>
      <Route path="/wait">
        <Wait />
      </Route>
      <Route path="/problem">
        <Problem problem={problem} submitProblemInput={submitProblemInput} />
      </Route>
      <Route path="/draw">
        <Drawing submitInvention={submitInvention} />
      </Route>
      <Route path="/presentation">
        <Presentation
          userName={userName}
          drawingsList={drawingsList}
          current={current}
          stage={stage}
          changePres={changePres}
        />
      </Route>
      <Route path="/vote">
        <Vote
          userName={userName}
          drawingsList={drawingsList}
          submitVote={submitVote}
          doneVoting={doneVoting}
        />
      </Route>
      <Route path="/results">
        <Results winners={winners} leaderboard={leaderboard} />
      </Route>
    </Switch>
  );
};

export default Game;
