import React from 'react';

function Button({ children, onClick, type = 'button', disabled = false, className = '', ...props }) {
  const combinedClassName = `form-button ${className}`.trim();

  return (
    <button
      className={combinedClassName} 
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
export default Button;