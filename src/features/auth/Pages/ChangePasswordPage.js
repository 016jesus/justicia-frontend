import React, { useState } from 'react';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';

const ChangePasswordPage = () => {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			alert('Las contraseñas no coinciden');
			return;
		}
		// Aquí iría la lógica para cambiar la contraseña
		alert('Contraseña cambiada (placeholder)');
	};

	return (
		<div style={{ padding: 24 }}>
			<h2>Cambiar Contraseña</h2>
			<form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
				<label>Contraseña actual</label>
				<Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
				<label>Nueva contraseña</label>
				<Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
				<label>Confirmar nueva contraseña</label>
				<Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
				<Button type="submit">Actualizar contraseña</Button>
			</form>
		</div>
	);
};

export default ChangePasswordPage;
