import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import apiClient from '../../../services/APIClient';
import './Auth.style.css'; 

function RecoveryPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    if (!email) {
      setError('Por favor ingresa un correo válido');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/reset-password', { email });
      // se espera recibir { "email": "user@example.com" } en caso de éxito
      if (res && res.data && res.data.email === email) {
        setSuccess(true);
        setMessage('Si existe una cuenta asociada, te hemos enviado un enlace para restablecer la contraseña. Revisa tu correo (bandeja de entrada o spam).');
      } else {
        setError('Respuesta inesperada del servidor. Intenta más tarde.');
      }
    } catch (err) {
      console.error('Error en reset-password:', err);
      if (err.response && err.response.data) {
        // intenta mostrar mensaje claro si viene del servidor
        const srvMsg = err.response.data.message || JSON.stringify(err.response.data);
        setError(srvMsg);
      } else if (err.request) {
        setError('No hay respuesta del servidor. Verifica tu conexión.');
      } else {
        setError('Error al enviar la solicitud: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-panel-form">
      <div className="form-card">
        {!success ? (
          <>
            <h2>Recuperar contraseña</h2>
            <p style={{ textAlign: 'center', color: 'var(--color-texto-secundario)', marginBottom: 20 }}>
              Ingresa el correo asociado a tu cuenta y te enviaremos un enlace seguro para restablecer tu contraseña.
            </p>

            {error && <div className="form-error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Correo electrónico</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="tu@correo.com" />
              </div>

              <div style={{ marginTop: 12 }}>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
                </Button>
              </div>
            </form>

            <div className="form-links">
              <p>¿Recordaste la contraseña? <Link to="/">Iniciar sesión</Link></p>
            </div>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon">
              ✓
            </div>
            <h2>Revisa tu correo</h2>
            <p className="success-message-text">{message}</p>
            <div style={{ width: '100%' }}>
              <Button onClick={() => window.location.assign('/')}>
                Volver al inicio
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecoveryPassword;