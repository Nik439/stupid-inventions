import React from 'react';
import styles from './styles.module.css';

const TextInput = props => (
  <input className={styles.input} autoComplete="off" {...props}></input>
);

export default TextInput;
