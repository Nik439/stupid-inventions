import React from 'react';
import './styles.css';

function Wait() {
  return (
    <div className="wait-container">
      <h1 data-testid="h1" className="wait-text">
        Waiting for other players...
      </h1>
    </div>
  );
}

export default Wait;
