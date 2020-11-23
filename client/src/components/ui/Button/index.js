import React from 'react';
import styles from './styles.module.css';

const Button = props => (
  <button className={styles.btn} {...props}>
    {props.value || 'Submit'}
  </button>
);

export default Button;
