import React from 'react';
import '../component-styles/LobbyComponent.css';
import Button from './Button';

function Lobby(props) {
  const playersList = props.playersList.map((player, index) => {
    return (
      <span key={index} className="lobby-player">
        {player}
      </span>
    );
  });

  return (
    <div className="lobby-container">
      <p className="lobby-room">
        <span>ROOM CODE</span>
        {props.room}
      </p>
      <div className="lobby-players-list">{playersList}</div>
      <Button type="button" onClick={props.startGame} value="START" />
    </div>
  );
}

export default Lobby;
