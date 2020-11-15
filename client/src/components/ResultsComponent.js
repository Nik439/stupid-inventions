import React, { useState, useEffect } from 'react';

function Results (props) {

  const winners = props.winners.map( (name, index) => {
    return (
      <h2 key={index} className="results-winner">{name}</h2>
    );
  });

  const leaderboard = props.leaderboard.map( (player, index) => {
    return (
      <tr key={index} className="lb-cell">
        <td className="lb-name">{player.name}</td>
        <td className="lb-votes">{player.votes}</td>
      </tr>
    );
  });

  return (
    <div className="results">
      <h1 className="results-title">{props.winners.length > 1 ? 'Winners' : 'Winner'}</h1>
      {winners}

      <table className="lb">
        <tr className="lb-cell">
          <th className="lb-name">NAME</th>
          <th className="lb-votes">VOTES</th>
        </tr>
        {leaderboard}
      </table>
    </div>
  );
}

export default Results;
