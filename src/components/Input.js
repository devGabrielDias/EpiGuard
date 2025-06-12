import React from 'react';

const Input = ({ 
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  disabled = false,
  className = '',
  error = false,
  ...props 
}) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg text-base placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed';
  
  const errorClasses = error 
    ? 'border-red-300 focus:ring-red-500' 
    : 'border-gray-300 hover:border-gray-400';
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${baseClasses} ${errorClasses} ${className}`}
      {...props}
    />
  );
};

export default Input;

