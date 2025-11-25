import React, { useState, useRef, useEffect } from 'react';
import { FaUniversalAccess, FaTimes, FaFont, FaPalette, FaUndo, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import styles from './AccessibilityButton.module.css';

const AccessibilityButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { fontSize, setFontSize, colorMode, setColorMode, darkMode, setDarkMode, resetTheme } = useTheme();
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Botón Flotante */}
      <button
        ref={buttonRef}
        className={styles.floatingButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Opciones de accesibilidad"
        aria-expanded={isOpen}
      >
        {isOpen ? <FaTimes /> : <FaUniversalAccess />}
      </button>

      {/* Panel de Opciones */}
      {isOpen && (
        <div ref={panelRef} className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Accesibilidad</h3>
            <button 
              className={styles.resetButton} 
              onClick={resetTheme}
              title="Restaurar configuración"
            >
              <FaUndo /> Restaurar
            </button>
          </div>

          {/* ✅ NUEVO: Wrapper con scroll */}
          <div className={styles.panelBody}>

          {/* ✅ NUEVO: Dark Mode Toggle */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>
              {darkMode ? <FaMoon /> : <FaSun />} Modo Oscuro
            </label>
            <button
              className={`${styles.toggleButton} ${darkMode ? styles.active : ''}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              <span className={styles.toggleSlider}></span>
              <span className={styles.toggleLabel}>
                {darkMode ? 'Activado' : 'Desactivado'}
              </span>
            </button>
          </div>

          {/* Tamaño de Fuente */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>
              <FaFont /> Tamaño de Fuente
            </label>
            <div className={styles.buttonGrid}>
              <button
                className={`${styles.option} ${fontSize === 'small' ? styles.active : ''}`}
                onClick={() => setFontSize('small')}
              >
                A
              </button>
              <button
                className={`${styles.option} ${fontSize === 'normal' ? styles.active : ''}`}
                onClick={() => setFontSize('normal')}
              >
                A
              </button>
              <button
                className={`${styles.option} ${fontSize === 'large' ? styles.active : ''}`}
                onClick={() => setFontSize('large')}
              >
                A
              </button>
              <button
                className={`${styles.option} ${fontSize === 'xlarge' ? styles.active : ''}`}
                onClick={() => setFontSize('xlarge')}
              >
                A
              </button>
            </div>
          </div>

          {/* Modo de Color */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>
              <FaPalette /> Modo de Color
            </label>
            <div className={styles.colorOptions}>
              <button
                className={`${styles.colorOption} ${colorMode === 'default' ? styles.active : ''}`}
                onClick={() => setColorMode('default')}
                disabled={darkMode}
              >
                <span className={styles.colorCircle} style={{ background: 'linear-gradient(135deg, #0F172A, #D97706)' }}></span>
                Original
              </button>
              <button
                className={`${styles.colorOption} ${colorMode === 'deuteranopia' ? styles.active : ''}`}
                onClick={() => setColorMode('deuteranopia')}
                disabled={darkMode}
              >
                <span className={styles.colorCircle} style={{ background: 'linear-gradient(135deg, #0047AB, #FF8C00)' }}></span>
                Daltonismo
              </button>
              <button
                className={`${styles.colorOption} ${colorMode === 'highContrast' ? styles.active : ''}`}
                onClick={() => setColorMode('highContrast')}
                disabled={darkMode}
              >
                <span className={styles.colorCircle} style={{ background: 'linear-gradient(135deg, #000000, #FFFFFF)' }}></span>
                Alto Contraste
              </button>
            </div>
            {darkMode && (
              <small className={styles.disabledNote}>
                💡 Los modos de color se desactivan en modo oscuro
              </small>
            )}
          </div>
          </div> {/* ✅ Cierre de panelBody */}

          <div className={styles.footer}>
            <small>💡 Estos ajustes se guardan automáticamente</small>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityButton;