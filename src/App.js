import { Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

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

// Loading fallback component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#666'
  }}>
    Cargando...
  </div>
);

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;