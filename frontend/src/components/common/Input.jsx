import React from 'react';
import { motion } from 'framer-motion';
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
      <motion.div
        className="input-wrapper"
        whileFocus={{ y: -2, scale: 1.005 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {LeftIcon && (
          <motion.div
            className="input-icon-left"
            whileHover={{ scale: 1.15 }}
          >
            <LeftIcon size={18} />
          </motion.div>
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
      </motion.div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="input-error-msg"
        >
          <AlertCircle size={14} />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
};
