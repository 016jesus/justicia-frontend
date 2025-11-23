import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import Logo from '../../../components/Logo/LogoV';
import FormError from './FormError'; // Asumo que lo tienes

import './Auth.style.css';

// Importamos los íconos centralizados
import { IconMail, IconLock, IconEye, IconEyeSlash } from './Icons/AuthIcons';

// Recibe las props de React Hook Form
function LoginForm({ register, handleSubmit, errors, loading, apiError }) {
  
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-container">
      {/* --- PANEL IZQUIERDO --- */}
      <div className="auth-panel-welcome">
        <div className="logo-container">
            <Logo /> 
        </div>
        <h1>Bienvenido a Juriscope</h1>
        <p>Tu plataforma de consulta judicial unificada. Accede a la información clave y gestiona tus procesos con confianza y estabilidad.</p>
      </div>

      {/* --- PANEL DERECHO --- */}
      <div className="auth-panel-form">
        <div className="form-card">
          <h2>Iniciar Sesión</h2>
          
          {/* Usamos el handleSubmit de RHF */}
          <form className="login-form" onSubmit={handleSubmit}>
            
            {/* --- CAMPO EMAIL --- */}
            <div className="form-group">
              <label className="form-label">Correo Electrónico:</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconMail /></span>
                <Input 
                  type="email" 
                  placeholder="ejemplo@correo.com" 
                  // Conectamos el campo con RHF
                  {...register("email")}
                  style={errors.email ? { borderColor: '#D32F2F' } : {}}
                />
              </div>
              {/* Mostramos el error de Zod */}
              <FormError error={errors.email} />
            </div>

            {/* --- CAMPO CONTRASEÑA --- */}
            <div className="form-group">
              <label className="form-label">Contraseña:</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconLock /></span>
                <Input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  // Conectamos el campo con RHF
                  {...register("password")}
                  style={errors.password ? { borderColor: '#D32F2F' } : {}}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <IconEyeSlash /> : <IconEye />}
                </button>
              </div>
              {/* Mostramos el error de Zod */}
              <FormError error={errors.password} />
            </div>

            {/* Mostramos el error de la API (si existe) */}
            {apiError && <p className="form-error-message">{apiError.message || apiError}</p>}
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="form-links">
            <p><Link className="link-forgot" to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link></p>
            <p>¿No tienes cuenta? <Link className="link-register" to="/registro">Regístrate</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
