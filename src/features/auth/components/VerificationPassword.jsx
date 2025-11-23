import React from 'react';
/* { Link } from 'react-router-dom';*/
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import './Auth.style.css'; 

function VerificationPassword() {


  const handleResend = (event) => {
    event.preventDefault();
    console.log("Disparador activado: Lógica para reenviar código aquí...");
    alert("Se ha enviado un nuevo código a tu correo.");
    
  };

  return (
    
    <div className="login-page-container"> 
      
      {}
      <div className="login-form-card"> 
        
        <h2>Verifica tu código</h2>
        <p className="subtitle">Ingresa el código que enviamos a tu correo electrónico.</p>
        
        <form className="login-form">
          <Input type="text" placeholder="Código de verificación" />
          
          <div className="checkbox-container">
            <input type="checkbox" id="updatePassword" defaultChecked />
            <label htmlFor="updatePassword">Actualizar contraseña</label>
          </div>

          <Input type="password" placeholder="Nueva contraseña" />
          <Input type="password" placeholder="Confirmar contraseña" />

          <Button type="submit">Continuar</Button>
        </form>

        <div className="login-links">
            <p>
              ¿No recibiste el código? {} <button type="button" onClick={handleResend} style={{background: 'none', border: 'none', color: '#003366', textDecoration: 'underline', cursor: 'pointer'}}>Reenviar</button>
            </p> 
        </div>
        
      </div>

    </div>
  );
}

export default VerificationPassword;