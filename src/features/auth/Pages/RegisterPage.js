import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm.jsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FullRegistrationSchema } from '../services/validation/RegisterSchema'; 

// (El componente RegistrationSuccess se queda igual)
function RegistrationSuccess() {
  const navigate = useNavigate();
  const handleGoToLogin = () => navigate('/');

  return (
    <div className="auth-container" style={{ justifyContent: 'center' }}>
      <div className="form-card" style={{ textAlign: 'center', gap: '20px', maxWidth: '500px' }}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#1FAE2D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <h2>¡Registro Exitoso!</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-texto-secundario)' }}>
          Tu cuenta ha sido creada. Ya puedes iniciar sesión.
        </p>
        <button 
          type="button"
          onClick={handleGoToLogin}
          style={{ width: '100%', padding: '12px', fontSize: '1rem', cursor: 'pointer', backgroundColor: '#198754', borderColor: '#198754', color: 'white', borderRadius: '8px', border: 'none' }}
        >
          Ir a Iniciar Sesión
        </button>
      </div>
    </div>
  );
}


function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // --- ¡CAMBIO AQUÍ! ---
  // Añadimos 'control' para los componentes personalizados
  const { 
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    control // <--- AÑADIDO
  } = useForm({
    resolver: zodResolver(FullRegistrationSchema),
    mode: 'onChange',
    defaultValues: {
      documentType: "CC",
      // Es buena idea poner un valor por defecto para los 'controller'
      documentNumber: "", 
      birthDate: null 
    }
  });

  // Lógica para "Siguiente"
  const handleNextStep = async () => {
    const fieldsToValidate = ['documentType', 'documentNumber', 'birthDate'];
    const isValid = await trigger(fieldsToValidate); 
    
    if (isValid) {
      setCurrentStep(2);
    }
  };

  // Lógica para "Anterior"
  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  // Lógica del Submit final (Paso 2)
  const onSubmitLogic = async (data) => {
    setLoading(true);
    setApiError(null);

    const apiRequestBody = {
      ...data,
      middleName: data.middleName || null,
      secondLastName: data.secondLastName || null,
      // 'birthDate' ya está en el formato correcto gracias a 'RegisterSchema.js'
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/register`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiRequestBody),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        if (response.status === 400) { 
          const firstErrorKey = Object.keys(errorData)[0];
          throw new Error(errorData[firstErrorKey]); 
        }
        throw new Error(errorData.message || 'Error al registrar. Intente de nuevo.');
      }

      setIsSuccess(true); 

    } catch (err) {
      setApiError(err.message);
      setCurrentStep(2); 
    } finally {
      setLoading(false); 
    }
  };

  if (isSuccess) {
    return <RegistrationSuccess />;
  }

  return (
    <RegisterForm
      // Props de RHF
      register={register}
      handleSubmit={handleSubmit(onSubmitLogic)}
      errors={errors}
      control={control} // <--- PASAMOS 'control' A LA VISTA
      
      // Props de control de UI
      loading={loading}
      apiError={apiError}
      
      // Props de control de Pasos
      currentStep={currentStep}
      handleNextStep={handleNextStep}
      handlePreviousStep={handlePreviousStep}
    />
  );
}

export default RegisterPage;