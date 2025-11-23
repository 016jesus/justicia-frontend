import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; 

import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import Logo from '../../../components/Logo/LogoV';
import FormError from './FormError';
import './Auth.style.css';
import { IconMail, IconLock, IconEye, IconEyeSlash } from './Icons/AuthIcons';

function RegisterForm({ 
    register, handleSubmit, errors, control,
    loading, apiError,
    currentStep, handleNextStep, handlePreviousStep
}) {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const today = new Date(); // Para bloquear fechas futuras

  return (
    <>
      <div className="auth-container">
        {/* --- PANEL IZQUIERDO --- */}
        <div className="auth-panel-welcome">
          <div className="logo-container">
            <Logo />
          </div>
          <h1>Crea tu Cuenta Juriscope</h1>
          <p>Regístrate para acceder a todas las funcionalidades de consulta y gestión de procesos.</p>
        </div>

        {/* --- PANEL DERECHO: FORMULARIO --- */}
        <div className="auth-panel-form">
          <div className="form-card register-form-card">
            <h2>Registro</h2>
            
            <form className="multi-step-form" onSubmit={handleSubmit}>
              
              {/* --- PASO 1: DATOS DE IDENTIFICACIÓN --- */}
              {currentStep === 1 && (
                <div className="form-step">
                  <h3>Paso 1: Datos de Identificación</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Tipo de Documento: </label>
                    {/* Un <select> simple puede usar 'register' */}
                    <select className="form-select" {...register("documentType")} style={errors.documentType ? { borderColor: '#D32F2F' } : {}}>
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="CE">Cédula de Extranjería</option>
                      <option value="PA">Pasaporte</option>
                      <option value="TI">Tarjeta de Identidad</option>
                    </select>
                    <FormError error={errors.documentType} />
                  </div>

                  {/* --- CAMPO DE DOCUMENTO CONTROLADO --- */}
                  <div className="form-group">
                    <label className="form-label">Número de Documento: </label>
                    <Controller
                      name="documentNumber"
                      control={control}
                      render={({ field }) => (
                        <Input 
                          {...field}
                          type="text" 
                          placeholder="1122024567"
                          style={errors.documentNumber ? { borderColor: '#D32F2F' } : {}}
                          // Filtra la entrada en tiempo real
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/[^0-9]/g, '');
                            const truncatedValue = numericValue.slice(0, 10);
                            field.onChange(truncatedValue);
                          }}
                        />
                      )}
                    />
                    <FormError error={errors.documentNumber} />
                  </div>

                  {/* --- CAMPO DE FECHA CONTROLADO (DatePicker) --- */}
                 <div className="form-group">
                    <label className="form-label">Fecha de Nacimiento:</label>

                    <Controller
                      name="birthDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          selected={field.value || null}
                          onChange={(date) => {
                            // Al seleccionar del calendario o ingresar una fecha válida:
                            if (date instanceof Date && !isNaN(date.getTime())) {
                              field.onChange(date);
                            } else {
                              // Si el usuario borra todo o escribe algo inválido (por ejemplo, 'abc'):
                              field.onChange(null);
                            }
                          }}

                          maxDate={today}
                          placeholderText="dd/mm/aaaa"
                          
                          /* --- Clases para el Ancho (Ahora 100%) --- */
                          className={`form-input ${errors.birthDate ? 'input-error' : ''}`}
                          wrapperClassName="datepicker-wrapper"

                          showPopperArrow={false}
                          popperPlacement="bottom-start"
                          dateFormat="dd/MM/yyyy"
                        />
                      )}
                    />

                    <FormError error={errors.birthDate} />
                  </div>

                  <div className="step-navigation">
                    <Button type="button" onClick={handleNextStep}>Siguiente</Button>
                  </div>
                </div>
              )}

              {/* --- PASO 2: DATOS DE LA CUENTA --- */}
              {currentStep === 2 && (
                <div className="form-step"> 
                  <h3>Paso 2: Datos de la Cuenta</h3>

                  {/* Los campos de texto simples usan 'register' */}
                  <div className="form-group">
                    <label className="form-label">Primer Nombre:</label>
                    <Input type="text" placeholder="Jesús" {...register("firstName")} style={errors.firstName ? { borderColor: '#D32F2F' } : {}} />
                    <FormError error={errors.firstName} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Segundo Nombre:</label>
                    <Input type="text" placeholder="Alfonso" {...register("middleName")} />
                    <FormError error={errors.middleName} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Primer Apellido:</label>
                    <Input type="text" placeholder="López" {...register("firstLastName")} style={errors.firstLastName ? { borderColor: '#D32F2F' } : {}} />
                    <FormError error={errors.firstLastName} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Segundo Apellido:</label>
                    <Input type="text" placeholder="Burgos" {...register("secondLastName")} />
                    <FormError error={errors.secondLastName} />
                  </div>

                  {/* --- EMAIL --- */}
                  <div className="form-group">
                    <label className="form-label">Correo Electrónico:</label>
                    <div className="input-wrapper">
                      <span className="input-icon"><IconMail /></span>
                      <Input type="email" placeholder="jesusBurgos@gmail.com" {...register("email")} style={errors.email ? { borderColor: '#D32F2F' } : {}} />
                    </div>
                    <FormError error={errors.email} />
                  </div>
                  
                  {/* --- CONTRASEÑA --- */}
                  <div className="form-group">
                    <label className="form-label">Contraseña:</label>
                    <div className="input-wrapper">
                      <span className="input-icon"><IconLock /></span>
                      <Input 
                        type={showPassword? 'text' : 'password'} 
                        {...register("password")}
                        style={errors.password ? { borderColor: '#D32F2F' } : {}}
                      />
                      <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(prev =>!prev)}>
                        {showPassword? <IconEyeSlash /> : <IconEye />}
                      </button>
                    </div>
                    <FormError error={errors.password} />
                  </div>
                  
                  {/* --- CONFIRMAR CONTRASEÑA --- */}
                  <div className="form-group">
                    <label className="form-label">Confirmar Contraseña:</label>
                    <div className="input-wrapper">
                      <span className="input-icon"><IconLock /></span>
                      <Input 
                        type={showConfirmPassword? 'text' : 'password'} 
                        {...register("confirmPassword")}
                        style={errors.confirmPassword ? { borderColor: '#D32F2F' } : {}}
                      />
                      <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(prev =>!prev)}>
                        {showConfirmPassword? <IconEyeSlash /> : <IconEye />}
                      </button>
                    </div>
                    <FormError error={errors.confirmPassword} />
                  </div>

                  {/* Mostramos el error de la API */}
                  {apiError && <p className="form-error-message form-full-width">{apiError}</p>}
                  
                  <div className="step-navigation">
                    <Button type="button" onClick={handlePreviousStep} className="button-secondary">Anterior</Button>
                    <Button type="submit" disabled={loading}>
                      {loading? 'Registrando...' : 'Registrar'}
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="form-links form-full-width">
                <p>¿Ya tienes cuenta? <Link to="/">Iniciar Sesión</Link></p>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterForm;