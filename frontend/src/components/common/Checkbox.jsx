import React from 'react';
import { Check } from 'lucide-react';

export const Checkbox = ({ id, name, checked, onChange, label }) => {
  const checkboxId = id || `chk-${name}`;

  return (
    <label htmlFor={checkboxId} className="checkbox-label">
      <input
        type="checkbox"
        id={checkboxId}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <div className="custom-checkbox">
        {checked && <Check size={13} strokeWidth={3} style={{ color: '#041410' }} />}
      </div>
      {label && <span>{label}</span>}
    </label>
  );
};
