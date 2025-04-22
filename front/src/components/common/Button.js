import React from 'react';
import './Button.css';

function Button({ type = 'button', className = '', children, ...props }) {
  return (
    <button type={type} className={`button ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;