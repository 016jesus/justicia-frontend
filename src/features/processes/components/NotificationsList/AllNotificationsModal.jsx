import React from 'react';
import styles from './AllNotificationsModal.module.css';
import { FaTimes, FaBell, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { markAsRead, deleteNotification, markAllAsRead } from '../../../../services/NotificationsAPI';
import NotificationDetailModal from '../NotificationDetail/NotificationDetailModal';

const AllNotificationsModal = ({ isOpen, onClose, notifications, onUpdate }) => {
  const [processing, setProcessing] = React.useState(false);
  const [selectedNotification, setSelectedNotification] = React.useState(null);
  const [showDetailModal, setShowDetailModal] = React.useState(false);

  const handleMarkAsRead = async (notificationId) => {
    try {
      setProcessing(true);
      await markAsRead(notificationId);
      if (onUpdate) await onUpdate();
    } catch (error) {
      console.error('Error marcando como leída:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta notificación?')) return;
    
    try {
      setProcessing(true);
      await deleteNotification(notificationId);
      if (onUpdate) await onUpdate();
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setProcessing(true);
      await markAllAsRead();
      if (onUpdate) await onUpdate();
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    } finally {
      setProcessing(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <FaBell className={styles.headerIcon} />
            <div>
              <h2 className={styles.title}>Todas las Notificaciones</h2>
              {unreadCount > 0 && (
                <span className={styles.subtitle}>{unreadCount} sin leer</span>
              )}
            </div>
          </div>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <FaTimes />
          </button>
        </div>

        {unreadCount > 0 && (
          <div className={styles.actions}>
            <button 
              className={styles.markAllButton}
              onClick={handleMarkAllAsRead}
              disabled={processing}
            >
              <FaCheckCircle />
              Marcar todas como leídas
            </button>
          </div>
        )}

        <div className={styles.content}>
          {notifications.length === 0 ? (
            <div className={styles.empty}>
              <FaBell className={styles.emptyIcon} />
              <p>No hay notificaciones</p>
              <span>Estás al día con todas tus actualizaciones</span>
            </div>
          ) : (
            <ul className={styles.notificationsList}>
              {notifications.map((notif) => (
                <li 
                  key={notif.notificationId} 
                  className={`${styles.notifItem} ${!notif.isRead ? styles.unread : ''}`}
                >
                  <div 
                    className={styles.notifContent}
                    onClick={() => {
                      setSelectedNotification(notif);
                      setShowDetailModal(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.notifHeader}>
                      {!notif.isRead && <span className={styles.unreadDot}></span>}
                      <span className={styles.notifType}>
                        {notif.type || 'Notificación'}
                      </span>
                      <span className={styles.notifDate}>
                        {notif.date ? new Date(notif.date).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : ''}
                      </span>
                    </div>
                    
                    <p className={styles.notifMessage}>
                      {notif.message || (notif.action && notif.action.description) || 'Nueva actividad en tu cuenta'}
                    </p>
                    
                    {notif.numeroRadicacion && (
                      <div className={styles.notifDetails}>
                        <span className={styles.detailLabel}>Radicado:</span>
                        <span className={styles.detailValue}>{notif.numeroRadicacion}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.notifActions}>
                    {!notif.isRead && (
                      <button
                        className={styles.actionButton}
                        onClick={() => handleMarkAsRead(notif.notificationId)}
                        disabled={processing}
                        title="Marcar como leída"
                      >
                        <FaCheckCircle />
                      </button>
                    )}
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDelete(notif.notificationId)}
                      disabled={processing}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal de Detalle de Notificación */}
      <NotificationDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedNotification(null);
        }}
        notification={selectedNotification}
        onMarkAsRead={async () => {
          if (onUpdate) await onUpdate();
        }}
      />
    </div>
  );
};

export default AllNotificationsModal;
