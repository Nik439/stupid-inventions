import '../component-styles/Button.css';

const Button = props => (
  <button className="btn" {...props}>
    {props.value || 'Submit'}
  </button>
);

export default Button;
