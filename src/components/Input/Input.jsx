import React from 'react';

const Input = React.forwardRef((
  { 
    type = 'text', 
    className = '', 
    placeholder, 
    ...props 
  }, 
  ref
) => {

  // Combinamos la clase base con cualquier otra (igual que tu Button)
  const combinedClassName = `form-input ${className}`.trim();

  return (
    <input
      // 1. Pasamos el ref de React Hook Form
      ref={ref}
      
      // 2. Pasamos las props estándar
      type={type}
      className={combinedClassName}
      placeholder={placeholder}
      
      // 3. Pasamos todas las demás props (esto incluirá
      //    el 'name', 'onBlur', y 'onChange' de RHF)
      {...props}
    />
  );
  
});

export default Input;