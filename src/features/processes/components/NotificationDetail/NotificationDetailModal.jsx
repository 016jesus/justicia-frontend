import React, { useState } from 'react';
import styles from './NotificationDetailModal.module.css';
import { FaTimes, FaEnvelope, FaEnvelopeOpen, FaCheckCircle, FaClock } from 'react-icons/fa';
import { markAsRead } from '../../../../services/NotificationsAPI';

const NotificationDetailModal = ({ isOpen, onClose, notification, onMarkAsRead }) => {
  const [isMarking, setIsMarking] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !notification) return null;

  const handleMarkAsRead = async () => {
    if (notification.isRead) {
      onClose();
      return;
    }

    setIsMarking(true);
    setError('');

    try {
      await markAsRead(notification.notificationId);
      
      if (onMarkAsRead) {
        onMarkAsRead(notification.notificationId);
      }
      
      // Cerrar modal después de marcar como leída
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('No se pudo marcar como leída');
    } finally {
      setIsMarking(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNotificationIcon = () => {
    // Determinar el ícono según el tipo de notificación
    if (notification.action?.type) {
      switch (notification.action.type) {
        case 'welcome':
          return '👋';
        case 'new_actuation':
          return '📄';
        case 'process_deleted':
          return '🗑️';
        case 'reminder':
          return '⏰';
        default:
          return '🔔';
      }
    }
    return '🔔';
  };

  const getNotificationTitle = () => {
    if (notification.action?.title) {
      return notification.action.title;
    }
    
    // Títulos basados en el tipo
    if (notification.action?.type === 'welcome') return 'Bienvenida';
    if (notification.action?.type === 'new_actuation') return 'Nueva Actuación';
    if (notification.action?.type === 'process_deleted') return 'Proceso Eliminado';
    if (notification.action?.type === 'reminder') return 'Recordatorio';
    
    return 'Notificación';
  };

  const getNotificationBody = () => {
    if (notification.message) {
      return notification.message;
    }
    
    if (notification.action?.description) {
      return notification.action.description;
    }
    
    return 'No hay contenido disponible para esta notificación.';
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.headerIcon}>{getNotificationIcon()}</span>
            <div className={styles.headerText}>
              <h2 className={styles.title}>{getNotificationTitle()}</h2>
              <div className={styles.meta}>
                <FaClock className={styles.metaIcon} />
                <span className={styles.metaText}>{formatDate(notification.date)}</span>
              </div>
            </div>
          </div>
          
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Estado de lectura */}
          <div className={styles.statusBanner}>
            {notification.isRead ? (
              <>
                <FaEnvelopeOpen className={styles.statusIcon} />
                <span className={styles.statusText}>Leída</span>
              </>
            ) : (
              <>
                <FaEnvelope className={styles.statusIcon} />
                <span className={`${styles.statusText} ${styles.unread}`}>Sin leer</span>
              </>
            )}
          </div>

          {/* Mensaje de la notificación */}
          <div className={styles.messageBox}>
            <p className={styles.message}>{getNotificationBody()}</p>
          </div>

          {/* Información adicional si existe */}
          {notification.action?.data && (
            <div className={styles.additionalInfo}>
              <h3 className={styles.infoTitle}>Detalles adicionales</h3>
              <div className={styles.infoContent}>
                {Object.entries(notification.action.data).map(([key, value]) => (
                  <div key={key} className={styles.infoItem}>
                    <span className={styles.infoKey}>{key}:</span>
                    <span className={styles.infoValue}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cerrar
          </button>
          
          {!notification.isRead && (
            <button 
              className={styles.markReadButton}
              onClick={handleMarkAsRead}
              disabled={isMarking}
            >
              {isMarking ? (
                <>
                  <div className={styles.buttonSpinner}></div>
                  Marcando...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Marcar como Leída
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;
