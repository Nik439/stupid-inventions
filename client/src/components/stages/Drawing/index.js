import React, {useRef, useState} from 'react';
import useTimer from '../../../hooks/timer';
import Canvas from '../../canvas';
import Button from '../../ui/Button';
import TextInput from '../../ui/TextInput';
import './styles.css';

function Drawing({submitInvention}) {
  const [name, setName] = useState('');

  // this will be passed on to canvas to have a ref of it
  const ref = useRef(null);

  const timer = useTimer(60000, () => {
    if (!name) {
      setName('artwork');
    }

    handleSubmit();
  });

  const handleSubmit = () => {
    if (name !== '') {
      let url = ref.current.toDataURL('image/png');

      let drawingData = {
        name,
        url,
      };

      submitInvention(drawingData);
    }
  };

  return (
    <div className="drawing-container">
      <label htmlFor="name" className="drawing-label">
        Time Remaining: {Math.ceil(timer / 1000)}
      </label>
      <label htmlFor="name" className="drawing-label">
        Invention Name
      </label>
      <div className="drawing-inputs">
        <label className="drawing-name-count">{name.length}/50</label>
        <TextInput
          name="name"
          maxLength="50"
          onChange={e => setName(e.target.value)}
          autoComplete="off"
          type="text"
          placeholder=""
        />
        <Button
          disabled={!name}
          onClick={handleSubmit}
          type="button"
          value="SUBMIT"
        />
      </div>
      <Canvas refProp={ref} />
    </div>
  );
}

export default Drawing;
