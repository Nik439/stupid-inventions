import React from 'react';

function Lobby(props) {
  const playersList = props.playersList.map((player, index) => {
    return (
      <span key={index} className="lobby-player">
        {player}
      </span>
    );
  });

  return (
    <div className="lobby">
      <p className="lobby-room">
        <span>ROOM CODE</span>
        {props.room}
      </p>
      <div className="lobby-players-list">{playersList}</div>
      <input
        className="lobby-start"
        type="button"
        onClick={props.startGame}
        value="START"
      ></input>
    </div>
  );
}

export default Lobby;
