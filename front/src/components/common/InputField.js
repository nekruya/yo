import React from 'react';
import './InputField.css';

function InputField({ label, name, value, onChange, type = 'text' }) {
  return (
    <div className="input-field">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default InputField;