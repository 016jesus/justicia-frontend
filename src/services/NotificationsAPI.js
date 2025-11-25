import apiClient from './APIClient';

/**
 * Servicio para gestionar notificaciones y simulaciones de prueba
 */

// ============================================
// ENDPOINTS DE PRUEBA (Test Controller)
// ============================================

/**
 * Obtener información del sistema de notificaciones de prueba
 */
export const getTestNotificationsInfo = async () => {
  const response = await apiClient.get('/api/test/notifications/info');
  return response.data;
};

/**
 * Enviar correo de bienvenida de prueba
 * @param {string} userDocumentNumber - Número de documento del usuario
 */
export const sendWelcomeNotification = async (userDocumentNumber) => {
  const response = await apiClient.post('/api/test/notifications/welcome', {
    userDocumentNumber
  });
  return response.data;
};

/**
 * Enviar notificación de nueva actuación de prueba
 * @param {Object} params
 * @param {string} params.userDocumentNumber
 * @param {string} params.numeroRadicacion
 * @param {string} params.actuacion
 * @param {string} params.fecha - Formato YYYY-MM-DD
 */
export const sendNewActuationNotification = async ({ userDocumentNumber, numeroRadicacion, actuacion, fecha }) => {
  const response = await apiClient.post('/api/test/notifications/new-actuation', {
    userDocumentNumber,
    numeroRadicacion,
    actuacion,
    fecha
  });
  return response.data;
};

/**
 * Enviar notificación de proceso eliminado de prueba
 * @param {Object} params
 * @param {string} params.userDocumentNumber
 * @param {string} params.numeroRadicacion
 */
export const sendProcessDeletedNotification = async ({ userDocumentNumber, numeroRadicacion }) => {
  const response = await apiClient.post('/api/test/notifications/process-deleted', {
    userDocumentNumber,
    numeroRadicacion
  });
  return response.data;
};

/**
 * Enviar recordatorio de actuaciones de prueba
 * @param {Object} params
 * @param {string} params.userDocumentNumber
 * @param {number} params.cantidadProcesos
 */
export const sendReminderNotification = async ({ userDocumentNumber, cantidadProcesos }) => {
  const response = await apiClient.post('/api/test/notifications/reminder', {
    userDocumentNumber,
    cantidadProcesos
  });
  return response.data;
};

// ============================================
// ENDPOINTS DE NOTIFICACIONES (Usuario autenticado)
// ============================================

/**
 * Obtener todas las notificaciones del usuario autenticado
 */
export const getMyNotifications = async () => {
  const response = await apiClient.get('/api/notifications/my-notifications');
  return response.data;
};

/**
 * Obtener notificaciones no leídas del usuario autenticado
 */
export const getUnreadNotifications = async () => {
  const response = await apiClient.get('/api/notifications/my-notifications/unread');
  return response.data;
};

/**
 * Contar notificaciones no leídas
 */
export const getUnreadCount = async () => {
  const response = await apiClient.get('/api/notifications/my-notifications/unread/count');
  return response.data;
};

/**
 * Marcar una notificación como leída
 * @param {string} notificationId - ID de la notificación
 */
export const markAsRead = async (notificationId) => {
  const response = await apiClient.put(`/api/notifications/${notificationId}/read`);
  return response.data;
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const markAllAsRead = async () => {
  const response = await apiClient.put('/api/notifications/mark-all-read');
  return response.data;
};

/**
 * Eliminar una notificación
 * @param {string} notificationId - ID de la notificación
 */
export const deleteNotification = async (notificationId) => {
  const response = await apiClient.delete(`/api/notifications/${notificationId}`);
  return response.data;
};
