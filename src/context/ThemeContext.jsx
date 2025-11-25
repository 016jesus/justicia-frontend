import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

// ✅ EXPORT NAMED (no default)
export const ThemeProvider = ({ children }) => {
  // Estados de accesibilidad
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || 'normal';
  });

  const [colorMode, setColorMode] = useState(() => {
    return localStorage.getItem('colorMode') || 'default';
  });

  // ✅ NUEVO: Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Aplicar cambios al DOM
  useEffect(() => {
    const root = document.documentElement;

    // ✅ TAMAÑO DE FUENTE (usa rem para escalar proporcionalmente)
    const fontSizeMap = {
      small: '14px',
      normal: '16px',
      large: '18px',
      xlarge: '20px'
    };
    root.style.fontSize = fontSizeMap[fontSize];
    localStorage.setItem('fontSize', fontSize);

    // ✅ DARK MODE (Colores suaves y elegantes)
    if (darkMode) {
      root.setAttribute('data-theme', 'dark');
      root.style.setProperty('--color-fondo', '#0B1120');
      root.style.setProperty('--color-tarjeta', '#1A2332');
      root.style.setProperty('--color-panel', '#1A2332');
      root.style.setProperty('--color-texto-principal', '#F8FAFC');
      root.style.setProperty('--color-texto-cuerpo', '#E2E8F0');
      root.style.setProperty('--color-texto-secundario', '#94A3B8');
      root.style.setProperty('--color-borde', '#2D3748');
      root.style.setProperty('--color-borde-soft', '#1E293B');
      root.style.setProperty('--brand-primary', '#60A5FA');
      root.style.setProperty('--brand-primary-light', '#3B82F6');
      root.style.setProperty('--brand-accent', '#FBBF24');
      root.style.setProperty('--brand-accent-hover', '#F59E0B');
      root.style.setProperty('--brand-accent-bg', '#292524');
      root.style.setProperty('--shadow-sm', '0 1px 3px 0 rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--shadow-md', '0 4px 6px -1px rgba(0, 0, 0, 0.4)');
      root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgba(0, 0, 0, 0.5)');
    } else {
      root.removeAttribute('data-theme');
      root.style.removeProperty('--color-fondo');
      root.style.removeProperty('--color-tarjeta');
      root.style.removeProperty('--color-panel');
      root.style.removeProperty('--color-texto-principal');
      root.style.removeProperty('--color-texto-cuerpo');
      root.style.removeProperty('--color-texto-secundario');
      root.style.removeProperty('--color-borde');
      root.style.removeProperty('--color-borde-soft');
      root.style.removeProperty('--brand-primary');
      root.style.removeProperty('--brand-accent');
    }
    localStorage.setItem('darkMode', darkMode);

    // ✅ MODO DE COLOR (Daltonismo / Alto Contraste)
    if (!darkMode && colorMode === 'default') {
      // Restaurar colores originales
      // Ya se hicieron arriba en el else de darkMode
    } else if (!darkMode && colorMode === 'deuteranopia') {
      // Azul fuerte + Naranja (Mejor para daltonismo rojo-verde)
      root.style.setProperty('--brand-primary', '#0047AB');
      root.style.setProperty('--brand-accent', '#FF8C00');
      root.style.setProperty('--color-texto-principal', '#1A1A1A');
    } else if (!darkMode && colorMode === 'highContrast') {
      // Blanco y Negro extremo
      root.style.setProperty('--brand-primary', '#000000');
      root.style.setProperty('--brand-accent', '#FFD700');
      root.style.setProperty('--color-texto-principal', '#000000');
      root.style.setProperty('--color-fondo', '#FFFFFF');
      root.style.setProperty('--color-tarjeta', '#F5F5F5');
    }
    localStorage.setItem('colorMode', colorMode);
  }, [fontSize, colorMode, darkMode]);

  const resetTheme = () => {
    setFontSize('normal');
    setColorMode('default');
    setDarkMode(false);
    localStorage.removeItem('fontSize');
    localStorage.removeItem('colorMode');
    localStorage.removeItem('darkMode');
  };

  const value = {
    fontSize,
    setFontSize,
    colorMode,
    setColorMode,
    darkMode,
    setDarkMode,
    resetTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};