import '../component-styles/TextInput.css';

const TextInput = props => (
  <input className="text-input" autoComplete="off" {...props}></input>
);

export default TextInput;
