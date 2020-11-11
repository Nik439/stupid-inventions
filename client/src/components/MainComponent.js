import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import { useLocalStorage  } from '@rehooks/local-storage';

import Home from './HomeComponent';

const ENDPOINT =`localhost:5000`;
const socket = socketIOClient(ENDPOINT);

function Main (params) {
  const [gamePhase, setGamePhase] = useState('home');
  const [userName, setUser] = useLocalStorage('name', '');
  const [homeError, setHomeError] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setHost] = useState(false);
  const [playersList, setPlayersList] = useState([]);

  useEffect(() => {
    socket.on('roomDoesntExist', () => {
      setHomeError("Room doesn't exist");
    });
    socket.on('nameAlreadyExists', () => {
      setHomeError("Player name already taken");
    });
    socket.on('joinRoom', (room, hosting) => {
      setHost(hosting);
      setRoomCode(room);
      setGamePhase('lobby');
    });
    socket.on('players', data => {
      console.log(data);
      setPlayersList(data);
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

  const Game = () => {
    switch (gamePhase) {
      case 'home':
        return (
          <Home name={userName} homeError={homeError} hostGame={hostGame} joinGame={joinGame}/>
        );
      case 'lobby':
        return(
          <div></div>
        );
      default:
        return <h1>error</h1>;
    }
    
  }

  return (
    <div className="container">
      <Game/>
    </div>
  );
}

export default Main;