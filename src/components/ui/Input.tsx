import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', fullWidth, ...props }, ref) => {
    const classNames = [
      styles.input,
      fullWidth ? styles.fullWidth : '',
      className,
    ].filter(Boolean).join(' ');

    return <input ref={ref} className={classNames} {...props} />;
  }
);

Input.displayName = 'Input';
