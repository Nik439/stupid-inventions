import React, { useState } from 'react';

function Home(props) {
  const [joinCode, setJoinCode] = useState('');
  const [nameCount, setNameCount] = useState(props.name ? props.name.length : 0);
  const [name, setName] = useState(props.name);

  return (
    <div className="home">
      <img className="home-logo" src="images/logo.svg" alt="logo"></img>
      {props.homeError !== '' ? <p className="home-error">{props.homeError}</p> : ''}
      <label className="home-name-count">{nameCount}/20</label>
      <input className="home-name" maxLength="50" type="text" autoComplete="off" value={name} onChange={e=>{setName(e.target.value); setNameCount(e.target.value.length)}} placeholder="ENTER NAME"></input>
      <div className="home-inputs">
        <input type="button" value="HOST GAME" className="home-button" onClick={() => props.hostGame(name)} ></input>
        <div className="home-join">
          <input className="home-code" type="text" autoComplete="off" value={joinCode} onChange={e=>setJoinCode(e.target.value)} placeholder="INSERT CODE"></input>
          <input type="button" value="JOIN GAME" className="home-button" onClick={()=>props.joinGame(joinCode, name)} ></input>
        </div>
      </div>
    </div>
  );
}

export default Home;