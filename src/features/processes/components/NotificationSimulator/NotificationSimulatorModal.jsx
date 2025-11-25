import React, { useState } from 'react';
import styles from './NotificationSimulatorModal.module.css';
import { FaTimes, FaPaperPlane, FaEnvelope, FaBell, FaTrash, FaClock } from 'react-icons/fa';
import {
  sendWelcomeNotification,
  sendNewActuationNotification,
  sendProcessDeletedNotification,
  sendReminderNotification
} from '../../../../services/NotificationsAPI';

const NotificationSimulatorModal = ({ isOpen, onClose, onSuccess }) => {
  const [notificationType, setNotificationType] = useState('welcome');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Estados para cada tipo de notificación
  const [userDocumentNumber, setUserDocumentNumber] = useState('');
  const [numeroRadicacion, setNumeroRadicacion] = useState('');
  const [actuacion, setActuacion] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [cantidadProcesos, setCantidadProcesos] = useState(5);

  const notificationTypes = [
    { value: 'welcome', label: 'Correo de Bienvenida', icon: <FaEnvelope /> },
    { value: 'new-actuation', label: 'Nueva Actuación', icon: <FaBell /> },
    { value: 'process-deleted', label: 'Proceso Eliminado', icon: <FaTrash /> },
    { value: 'reminder', label: 'Recordatorio', icon: <FaClock /> }
  ];

  const resetForm = () => {
    setUserDocumentNumber('');
    setNumeroRadicacion('');
    setActuacion('');
    setFecha(new Date().toISOString().split('T')[0]);
    setCantidadProcesos(5);
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let result;
      
      switch (notificationType) {
        case 'welcome':
          result = await sendWelcomeNotification(userDocumentNumber);
          break;
        case 'new-actuation':
          result = await sendNewActuationNotification({
            userDocumentNumber,
            numeroRadicacion,
            actuacion,
            fecha
          });
          break;
        case 'process-deleted':
          result = await sendProcessDeletedNotification({
            userDocumentNumber,
            numeroRadicacion
          });
          break;
        case 'reminder':
          result = await sendReminderNotification({
            userDocumentNumber,
            cantidadProcesos: parseInt(cantidadProcesos)
          });
          break;
        default:
          throw new Error('Tipo de notificación no válido');
      }

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess(result);
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al enviar la notificación');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <FaPaperPlane className={styles.titleIcon} />
            Simular Notificación
          </h2>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
            aria-label="Cerrar modal"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Selector de tipo de notificación */}
          <div className={styles.typeSelector}>
            {notificationTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                className={`${styles.typeButton} ${notificationType === type.value ? styles.typeButtonActive : ''}`}
                onClick={() => {
                  setNotificationType(type.value);
                  setError(null);
                }}
              >
                <span className={styles.typeIcon}>{type.icon}</span>
                <span className={styles.typeLabel}>{type.label}</span>
              </button>
            ))}
          </div>

          {/* Campos del formulario */}
          <div className={styles.formFields}>
            {/* Campo común: Número de documento */}
            <div className={styles.formGroup}>
              <label htmlFor="userDocumentNumber" className={styles.label}>
                Número de Documento <span className={styles.required}>*</span>
              </label>
              <input
                id="userDocumentNumber"
                type="text"
                className={styles.input}
                value={userDocumentNumber}
                onChange={(e) => setUserDocumentNumber(e.target.value)}
                placeholder="Ej: 123456789"
                required
              />
            </div>

            {/* Campos específicos por tipo */}
            {(notificationType === 'new-actuation' || notificationType === 'process-deleted') && (
              <div className={styles.formGroup}>
                <label htmlFor="numeroRadicacion" className={styles.label}>
                  Número de Radicación <span className={styles.required}>*</span>
                </label>
                <input
                  id="numeroRadicacion"
                  type="text"
                  className={styles.input}
                  value={numeroRadicacion}
                  onChange={(e) => setNumeroRadicacion(e.target.value)}
                  placeholder="Ej: 50001333100120070007600"
                  required
                />
              </div>
            )}

            {notificationType === 'new-actuation' && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="actuacion" className={styles.label}>
                    Descripción de la Actuación <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="actuacion"
                    className={styles.textarea}
                    value={actuacion}
                    onChange={(e) => setActuacion(e.target.value)}
                    placeholder="Describa la actuación judicial..."
                    rows={3}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="fecha" className={styles.label}>
                    Fecha de la Actuación <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="fecha"
                    type="date"
                    className={styles.input}
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {notificationType === 'reminder' && (
              <div className={styles.formGroup}>
                <label htmlFor="cantidadProcesos" className={styles.label}>
                  Cantidad de Procesos <span className={styles.required}>*</span>
                </label>
                <input
                  id="cantidadProcesos"
                  type="number"
                  className={styles.input}
                  value={cantidadProcesos}
                  onChange={(e) => setCantidadProcesos(e.target.value)}
                  min="1"
                  max="100"
                  required
                />
              </div>
            )}
          </div>

          {/* Mensajes de estado */}
          {error && (
            <div className={styles.alert} role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className={styles.success} role="status">
              ✓ Notificación enviada exitosamente
            </div>
          )}

          {/* Botones de acción */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Enviando...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Enviar Notificación
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationSimulatorModal;
