import React, { useState, useEffect } from 'react';

function Problem (props) {
  const [problem, setProblem] = useState('');
  const [problemCount, setProblemCount] = useState(0);
  const [input, setInput] = useState('');

  useEffect(()=>{
    let prob = props.problem.replace('#', '_____');
    setProblem(prob);
  },[props.problem]);

  function handleSubmit (e) {
    e.preventDefault();
    if (input !== '') {
      let probInput = props.problem.replace('#', input.toUpperCase());
      props.submitProblemInput(probInput);
    }
  }

  return (
    <form className="problem" onSubmit={e => handleSubmit(e)}>
      <h2 className="problem-prompt">{problem}</h2>
      <label className="problem-input-count">{problemCount}/50</label>
      <input className="problem-input" maxLength="50" autoComplete="off" type="text" value={input} onChange={(e) => {setInput(e.target.value); setProblemCount(e.target.value.length);}} placeholder="Fill the blank"></input>
      <input className="problem-submit" type="submit" value="SUBMIT" ></input>
    </form>
  );
}

export default Problem;