import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css'


interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> { }

const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => (<input ref={ref} className={styles.input} {...props} />)
)

export default Input;
