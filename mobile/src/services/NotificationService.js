import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_KEY = '@notifications';

// Configurar el handler de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Solicitar permisos de notificaciones
 */
export const requestNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    Alert.alert(
      'Permisos requeridos',
      'Para recibir notificaciones sobre actualizaciones de procesos, por favor activa los permisos en la configuración.'
    );
    return false;
  }
  
  return true;
};

/**
 * Guardar notificación en AsyncStorage
 */
const saveNotification = async (notification) => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    const notifications = stored ? JSON.parse(stored) : [];
    
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    notifications.unshift(newNotification);
    
    // Mantener solo las últimas 50 notificaciones
    if (notifications.length > 50) {
      notifications.splice(50);
    }
    
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    return newNotification;
  } catch (error) {
    console.error('Error guardando notificación:', error);
    return null;
  }
};

/**
 * Enviar notificación local
 */
export const sendLocalNotification = async ({ title, body, data = {} }) => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;
    
    // Guardar en AsyncStorage
    const savedNotification = await saveNotification({ title, body, data });
    
    // Enviar notificación local
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Inmediatamente
    });
    
    return savedNotification;
  } catch (error) {
    console.error('Error enviando notificación:', error);
    return null;
  }
};

/**
 * Obtener todas las notificaciones
 */
export const getNotifications = async () => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    return [];
  }
};

/**
 * Marcar notificación como leída
 */
export const markAsRead = async (notificationId) => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    const notifications = stored ? JSON.parse(stored) : [];
    
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
    return false;
  }
};

/**
 * Marcar todas como leídas
 */
export const markAllAsRead = async () => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    const notifications = stored ? JSON.parse(stored) : [];
    
    const updated = notifications.map(n => ({ ...n, read: true }));
    
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error marcando todas como leídas:', error);
    return false;
  }
};

/**
 * Eliminar notificación
 */
export const deleteNotification = async (notificationId) => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    const notifications = stored ? JSON.parse(stored) : [];
    
    const filtered = notifications.filter(n => n.id !== notificationId);
    
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error eliminando notificación:', error);
    return false;
  }
};

/**
 * Limpiar todas las notificaciones
 */
export const clearAllNotifications = async () => {
  try {
    await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
    return true;
  } catch (error) {
    console.error('Error limpiando notificaciones:', error);
    return false;
  }
};

/**
 * Obtener contador de notificaciones no leídas
 */
export const getUnreadCount = async () => {
  try {
    const notifications = await getNotifications();
    return notifications.filter(n => !n.read).length;
  } catch (error) {
    console.error('Error obteniendo contador:', error);
    return 0;
  }
};

/**
 * Simular notificación de actualización de proceso
 */
export const simulateProcessUpdate = async (processNumber) => {
  const randomTypes = [
    {
      title: '📋 Nueva Actuación',
      body: `Se registró una nueva actuación en el proceso ${processNumber}`,
      type: 'new-actuation',
    },
    {
      title: '📄 Nuevo Documento',
      body: `Se agregó un nuevo documento al proceso ${processNumber}`,
      type: 'new-document',
    },
    {
      title: '⚖️ Cambio de Estado',
      body: `El proceso ${processNumber} cambió de estado`,
      type: 'status-change',
    },
    {
      title: '📅 Fecha de Audiencia',
      body: `Se programó una audiencia para el proceso ${processNumber}`,
      type: 'hearing-date',
    },
  ];
  
  const notification = randomTypes[Math.floor(Math.random() * randomTypes.length)];
  
  return await sendLocalNotification({
    ...notification,
    data: { processNumber, type: notification.type },
  });
};

/**
 * Enviar notificación de bienvenida
 */
export const sendWelcomeNotification = async (userName) => {
  return await sendLocalNotification({
    title: '👋 ¡Bienvenido a JustiConsulta!',
    body: `Hola ${userName}, gracias por registrarte. Comienza a consultar tus procesos judiciales.`,
    data: { type: 'welcome' },
  });
};

/**
 * Enviar notificación de proceso eliminado
 */
export const sendProcessDeletedNotification = async (processNumber) => {
  return await sendLocalNotification({
    title: '🗑️ Proceso Eliminado',
    body: `El proceso ${processNumber} ha sido eliminado de tu lista de seguimiento.`,
    data: { processNumber, type: 'process-deleted' },
  });
};

/**
 * Enviar recordatorio de procesos
 */
export const sendReminderNotification = async (processCount) => {
  return await sendLocalNotification({
    title: '🔔 Recordatorio',
    body: `Tienes ${processCount} ${processCount === 1 ? 'proceso' : 'procesos'} guardados. Revisa las actualizaciones recientes.`,
    data: { type: 'reminder', processCount },
  });
};

/**
 * Enviar notificación de nueva actuación específica
 */
export const sendNewActuationNotification = async (processNumber, actuacion, fecha) => {
  return await sendLocalNotification({
    title: '📋 Nueva Actuación',
    body: `${processNumber}: ${actuacion}`,
    data: { processNumber, type: 'new-actuation', actuacion, fecha },
  });
};
