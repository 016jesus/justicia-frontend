import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AccessibilityButton from './components/AccessibilityButton/AccessibilityButton';
import { Toaster } from 'react-hot-toast';

// Lazy loading de páginas principales
const LoginPage = lazy(() => import('./features/auth/Pages/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/Pages/RegisterPage'));
const ProcessConsultationPage = lazy(() => import('./features/processes/pages/ProcessConsultationPage'));
const ProcessDetailPage = lazy(() => import('./features/processes/pages/ProcessDetailPage'));
const ProcessHistoryPage = lazy(() => import('./features/processes/pages/ProcessHistoryPage'));
const MyProcessesPage = lazy(() => import('./features/processes/pages/MyProcessesPage'));
const CargarPage = lazy(() => import('./features/processes/pages/CargarPage'));
const RecoveryPasswordPage = lazy(() => import('./features/auth/Pages/RecoveryPasswordPage'));
const VerificationPasswordPage = lazy(() => import('./features/auth/Pages/VerificationPasswordPage'));
const UpdatePasswordPage = lazy(() => import('./features/auth/Pages/UpdatePasswordPage'));

// ✅ Skeleton Loading mejorado
const PageLoader = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '20px',
    background: 'var(--color-fondo)'
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      border: '4px solid var(--color-borde)',
      borderTop: '4px solid var(--brand-accent)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <p style={{ 
      color: 'var(--color-texto-secundario)', 
      fontSize: '1rem',
      fontWeight: 500
    }}>
      Cargando...
    </p>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        {/* ✅ Toast Notifications con configuración inline */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
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
            }
          }}
        />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/consultas" element={<ProcessConsultationPage />} />
            <Route path="/consultas/detalle/:idProceso" element={<ProcessDetailPage />} />
            <Route path="/consultas/historial" element={<ProcessHistoryPage />} />
            <Route path="/mis-procesos" element={<MyProcessesPage />} />
            <Route path="/cargar" element={<CargarPage />} />
            <Route path="/recuperar-contrasena" element={<RecoveryPasswordPage />} />
            <Route path="/verificar-contrasena" element={<VerificationPasswordPage />} />
            <Route path="/restablecer-contrasena" element={<UpdatePasswordPage />} />
          </Routes>
        </Suspense>

        {/* ✅ Botón Flotante de Accesibilidad (global) */}
        <AccessibilityButton />
      </div>
    </ThemeProvider>
  );
}

export default App;


