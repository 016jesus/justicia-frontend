// src/config/toastConfig.js
import toast from 'react-hot-toast';

// Configuración global de toasts
const toastConfig = {
  duration: 4000,
  position: 'top-right',
  
  // Estilos personalizados
  style: {
    background: 'var(--color-tarjeta)',
    color: 'var(--color-texto-principal)',
    border: '1px solid var(--color-borde)',
    borderRadius: '12px',
    padding: '16px 20px',
    fontSize: '0.95rem',
    fontWeight: '500',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
    maxWidth: '400px'
  },

  // Estilos específicos por tipo
  success: {
    icon: '✅',
    style: {
      border: '1px solid #059669',
      background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)'
    }
  },

  error: {
    icon: '❌',
    style: {
      border: '1px solid #DC2626',
      background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)'
    }
  },

  loading: {
    icon: '⏳',
    style: {
      border: '1px solid var(--brand-accent)',
      background: 'var(--brand-accent-bg)'
    }
  }
};

// Funciones helper para usar en toda la app
export const showToast = {
  success: (message) => toast.success(message, toastConfig.success),
  error: (message) => toast.error(message, toastConfig.error),
  loading: (message) => toast.loading(message, toastConfig.loading),
  info: (message) => toast(message, {
    icon: 'ℹ️',
    style: {
      ...toastConfig.style,
      border: '1px solid var(--brand-primary)',
      background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)'
    }
  }),
  warning: (message) => toast(message, {
    icon: '⚠️',
    style: {
      ...toastConfig.style,
      border: '1px solid #F59E0B',
      background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)'
    }
  }),
  promise: (promise, messages) => toast.promise(promise, messages, toastConfig)
};

// ✅ Exportar tanto la config como los helpers
export { toastConfig };
export default showToast;