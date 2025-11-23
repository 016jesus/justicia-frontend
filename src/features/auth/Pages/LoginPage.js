import React from 'react';
import { useAuth } from '../../../context/AuthContext.js';
import LoginForm from '../components/LoginForm.jsx'; // Asegúrate que la extensión sea .jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '../services/validation/LoginSchema.js';

function LoginPage() {
  // Tu hook de Auth
  const { login, loading, error: apiError } = useAuth(); 

  // React Hook Form
  const { 
    register,
    handleSubmit,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange'
  });

  // Lógica de Submit (ya validada por Zod)
  const onSubmitLogic = async (data) => {
    await login(data); // Llama a tu AuthContext con { email, password }
  };

  return (
    <div className="login-page-container">
      <LoginForm 
        // Props de React Hook Form
        register={register}
        handleSubmit={handleSubmit(onSubmitLogic)} 
        errors={errors} 

        // Props de tu API/Context
        loading={loading}
        apiError={apiError} 
      />
    </div>
  );
}

export default LoginPage;