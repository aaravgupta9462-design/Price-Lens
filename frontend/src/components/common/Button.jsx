import React from 'react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'outline' | 'google'
  onClick,
  disabled = false,
  isLoading = false,
  className = '',
  icon: Icon
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`btn btn-${variant} ${className}`}
    >
      {isLoading ? (
        <>
          <div className="btn-spinner" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={18} />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
