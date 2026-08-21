import React from 'react';
import { motion } from 'framer-motion';

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
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={disabled || isLoading ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.96, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
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
    </motion.button>
  );
};
