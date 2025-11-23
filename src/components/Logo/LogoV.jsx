import React from 'react';
import LogoSvg from './Logo'; // Importamos el SVG base

const LogoV = () => {
  return (
    // Usamos la clase que ya tienes definida en tu CSS
    <div className="juriscope-logo-container">
      
      {/* 1. El Logo SVG (con un tamaño fijo) */}
      <LogoSvg width="150px" height="150px" /> 

      {/* 2. El Texto "JURISCOPE" */}
      <span className="juriscope-text">
        JURISCOPE
      </span>

    </div>
  );
};

export default LogoV;