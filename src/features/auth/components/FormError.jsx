import React from 'react';
const errorStyle = {
    color: '#D32F2F', // Un rojo estándar para errores
    fontSize: '0.75rem', 
    marginTop: '4px',
    marginBottom: '8px',
    textAlign: 'left',
};

// El componente recibe el objeto de error de React Hook Form
function FormError({ error }) {
    if (!error) {
        return null;
    }
    return (
        <p className="form-error-message" style={errorStyle}>
            {error.message}
        </p>
    );
}

export default FormError;