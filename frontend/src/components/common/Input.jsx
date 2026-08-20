import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  leftIcon: LeftIcon,
  rightElement,
  error,
  required = false,
  autoComplete,
  id,
  maxLength
}) => {
  const inputId = id || `input-${name}`;

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          <span>
            {label} {required && <span style={{ color: 'var(--primary-emerald)' }}>*</span>}
          </span>
        </label>
      )}
      <div className="input-wrapper">
        {LeftIcon && (
          <div className="input-icon-left">
            <LeftIcon size={18} />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className={`custom-input ${!LeftIcon ? 'no-left-icon' : ''} ${
            rightElement ? 'has-right-btn' : ''
          } ${error ? 'is-error' : ''}`}
        />
        {rightElement}
      </div>
      {error && (
        <div className="input-error-msg">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
