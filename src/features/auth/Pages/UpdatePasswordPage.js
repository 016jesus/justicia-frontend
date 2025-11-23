import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import '../components/Auth.style.css';

const baseURL = process.env.REACT_APP_API_URL || 'https://proyecto-justiconsulta.onrender.com';
const API_KEY = 'APP-CLIENT-a20ceb8b-b6c3-4620-a560-45c39746a30c';

function parseHashToken() {
  // Expected: #access_token=TOKEN or #access_token=TOKEN&...
  const hash = window.location.hash || '';
  if (!hash.startsWith('#')) return null;
  const params = new URLSearchParams(hash.substring(1));
  const t = params.get('access_token');
  return t && t.trim().length > 0 ? t : null;
}

const UpdatePasswordPage = () => {
  const token = useMemo(() => parseHashToken(), []);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMessage(null);
    setError(null);
  }, [password, confirm]);

  if (!token) {
    return (
      <div className="auth-container" style={{ justifyContent: 'center' }}>
        <div className="form-card" style={{ maxWidth: 520, textAlign: 'center' }}>
          <h2>Acceso no autorizado</h2>
          <p style={{ color: 'var(--color-texto-secundario)', marginTop: 8 }}>
            No se encontró el token de acceso en la URL. Por favor, solicita nuevamente el enlace de restablecimiento.
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!password || !confirm) {
      setError('Completa ambos campos.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setSubmitting(true);
    try {
      const url = `${baseURL}auth/update-password`;
      const res = await axios.post(
        url,
        { password },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );

      if (res.status === 200) {
        setMessage('Tu contraseña ha sido restablecida. Inicia sesión con tu nueva contraseña.');
      } else {
        setError('No se pudo actualizar la contraseña. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error update-password:', err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        const msg = data.message || data.Message || 'Error al actualizar la contraseña.';
        setError(msg);
      } else if (err.request) {
        setError('No hubo respuesta del servidor. Verifica tu conexión.');
      } else {
        setError(err.message || 'Error desconocido.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container" style={{ justifyContent: 'center' }}>
      <div className="form-card" style={{ maxWidth: 520 }}>
        <h2>Restablecer contraseña</h2>

        {error && (
          <div className="form-error-message" role="alert">{error}</div>
        )}
        {message && (
          <div style={{
            background: 'var(--color-success, #10B981)10',
            border: '1px solid rgba(16,185,129,0.25)',
            color: '#0B5D4A',
            padding: 12,
            borderRadius: 8,
            marginBottom: 16
          }}>
            {message}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Nueva contraseña</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar contraseña</label>
            <input
              className="form-input"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>

          <button className="form-button" type="submit" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Restablecer contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
