import React, { useEffect } from 'react';
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';

const OnboardingTour = ({ enabled, onExit }) => {
  const steps = [
    {
      element: '#radicacion',
      intro: '👋 ¡Bienvenido! Empieza aquí ingresando el número de radicación del proceso que deseas consultar.',
      position: 'bottom'
    },
    {
      element: '.btn-primary',
      intro: '🔍 Haz clic aquí para buscar. El botón se activa cuando ingresas al menos 10 dígitos.',
      position: 'bottom'
    },
    {
      element: '[aria-label="Opciones de accesibilidad"]',
      intro: '♿ ¿Necesitas ayuda? Aquí puedes ajustar el tamaño de fuente, activar modo oscuro o cambiar los colores para mejor legibilidad.',
      position: 'left'
    },
    {
      intro: '✨ ¡Listo! Ahora puedes explorar la plataforma con confianza.'
    }
  ];

  useEffect(() => {
    // Guardar que ya vio el tour
    if (!enabled) {
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, [enabled]);

  return (
    <Steps
      enabled={enabled}
      steps={steps}
      initialStep={0}
      onExit={onExit}
      options={{
        nextLabel: 'Siguiente →',
        prevLabel: '← Anterior',
        skipLabel: 'Saltar',
        doneLabel: '¡Entendido!',
        showBullets: true,
        showProgress: true,
        exitOnOverlayClick: false,
        overlayOpacity: 0.7,
        tooltipClass: 'customTooltip'
      }}
    />
  );
};

export default OnboardingTour;