// components/ui/button.js

import React from 'react';
import classNames from 'classnames'; // Optional: if you want to handle dynamic classes

export function Button({ children, onClick, type = 'button', variant = 'primary', ...props }) {
  const baseStyles = 'px-4 py-2 font-semibold rounded';
  const variantStyles = variant === 'outline' 
    ? 'border border-gray-800 text-gray-800 bg-transparent hover:bg-gray-200' 
    : 'bg-blue-500 text-white hover:bg-blue-600';
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames(baseStyles, variantStyles)} // Combines styles dynamically
      {...props}
    >
      {children}
    </button>
  );
}
