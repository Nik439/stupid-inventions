import React, {useState} from 'react';
import Button from '../../ui/Button';
import TextInput from '../../ui/TextInput';
import './styles.css';

function Home(props) {
  const [joinCode, setJoinCode] = useState('');
  const [name, setName] = useState(props.name);

  return (
    <div className="home-container">
      <img className="home-logo" src="images/logo.svg" alt="logo"></img>
      {props.homeError !== '' ? (
        <p className="home-error">{props.homeError}</p>
      ) : (
        ''
      )}
      <label className="home-name-count">{name.length}/20</label>
      <TextInput
        maxLength="20"
        type="text"
        autoComplete="off"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="ENTER NAME"
      />
      <div className="home-inputs">
        <Button
          disabled={joinCode || !name}
          value="HOST GAME"
          onClick={() => props.hostGame(name)}
        />
        <div className="home-join">
          <TextInput
            maxLength="3"
            type="text"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            placeholder="INSERT CODE"
          />
          <Button
            value="JOIN GAME"
            disabled={!joinCode || !name}
            onClick={() => props.joinGame(joinCode, name)}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
