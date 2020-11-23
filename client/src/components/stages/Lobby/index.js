import React from 'react';
import Button from '../../ui/Button';
import './styles.css';

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
      <Button onClick={props.startGame} value="START" />
    </div>
  );
}

export default Lobby;
