import React, {useEffect, useState} from 'react';
import Button from '../../ui/Button';
import TextInput from '../../ui/TextInput';
import './styles.css';

function Problem(props) {
  const [problem, setProblem] = useState('');
  const [problemCount, setProblemCount] = useState(0);
  const [input, setInput] = useState('');

  useEffect(() => {
    let prob = props.problem.replace('#', '_____');
    setProblem(prob);
  }, [props.problem]);

  function handleSubmit(e) {
    e.preventDefault();
    if (input !== '') {
      let probInput = props.problem.replace('#', input.toUpperCase());
      props.submitProblemInput(probInput);
    }
  }

  return (
    <form className="problem-container" onSubmit={e => handleSubmit(e)}>
      <h2 className="problem-prompt">{problem}</h2>
      <label className="problem-input-count">{problemCount}/50</label>
      <TextInput
        aria-label="problem-input"
        maxLength="50"
        autoComplete="off"
        type="text"
        value={input}
        onChange={e => {
          setInput(e.target.value);
          setProblemCount(e.target.value.length);
        }}
        placeholder="Fill the blank"
      />
      <Button type="submit" value="SUBMIT" />
    </form>
  );
}

export default Problem;
