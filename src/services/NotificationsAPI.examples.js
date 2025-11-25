/**
 * Ejemplos de uso del servicio NotificationsAPI
 * 
 * Este archivo contiene ejemplos de cómo usar el servicio de notificaciones
 * tanto para testing como para integración en otros componentes.
 */

import {
  sendWelcomeNotification,
  sendNewActuationNotification,
  sendProcessDeletedNotification,
  sendReminderNotification,
  getMyNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../services/NotificationsAPI';

// ============================================
// EJEMPLOS DE NOTIFICACIONES DE PRUEBA
// ============================================

/**
 * Ejemplo 1: Enviar correo de bienvenida
 */
export const ejemploBienvenida = async () => {
  try {
    const resultado = await sendWelcomeNotification('123456789');
    console.log('✓ Correo de bienvenida enviado:', resultado);
    return resultado;
  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  }
};

/**
 * Ejemplo 2: Enviar notificación de nueva actuación
 */
export const ejemploNuevaActuacion = async () => {
  try {
    const resultado = await sendNewActuationNotification({
      userDocumentNumber: '123456789',
      numeroRadicacion: '50001333100120070007600',
      actuacion: 'Se admite la demanda y se ordena correr traslado a la parte demandada por el término de 20 días',
      fecha: '2024-11-24'
    });
    console.log('✓ Notificación de actuación enviada:', resultado);
    return resultado;
  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  }
};

/**
 * Ejemplo 3: Enviar notificación de proceso eliminado
 */
export const ejemploProcesoEliminado = async () => {
  try {
    const resultado = await sendProcessDeletedNotification({
      userDocumentNumber: '123456789',
      numeroRadicacion: '50001333100120070007600'
    });
    console.log('✓ Notificación de eliminación enviada:', resultado);
    return resultado;
  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  }
};

/**
 * Ejemplo 4: Enviar recordatorio
 */
export const ejemploRecordatorio = async () => {
  try {
    const resultado = await sendReminderNotification({
      userDocumentNumber: '123456789',
      cantidadProcesos: 5
    });
    console.log('✓ Recordatorio enviado:', resultado);
    return resultado;
  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  }
};

// ============================================
// EJEMPLOS DE GESTIÓN DE NOTIFICACIONES
// ============================================

/**
 * Ejemplo 5: Obtener todas mis notificaciones
 */
export const ejemploObtenerNotificaciones = async () => {
  try {
    const notificaciones = await getMyNotifications();
    console.log('✓ Notificaciones obtenidas:', notificaciones);
    return notificaciones;
  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  }
};

/**
 * Ejemplo 6: Obtener solo notificaciones no leídas
 */
export const ejemploObtenerNoLeidas = async () => {
  try {
    const noLeidas = await getUnreadNotifications();
    console.log('✓ Notificaciones no leídas:', noLeidas);
    return noLeidas;
  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  }
};

/**
 * Ejemplo 7: Contar notificaciones no leídas
 */
export const ejemploContarNoLeidas = async () => {
  try {
    const count = await getUnreadCount();
    console.log('✓ Cantidad de no leídas:', count);
    return count;
  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  }
};

/**
 * Ejemplo 8: Marcar notificación como leída
 */
export const ejemploMarcarComoLeida = async (notificationId) => {
  try {
    const resultado = await markAsRead(notificationId);
    console.log('✓ Notificación marcada como leída:', resultado);
    return resultado;
  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  }
};

/**
 * Ejemplo 9: Marcar todas como leídas
 */
export const ejemploMarcarTodasLeidas = async () => {
  try {
    const resultado = await markAllAsRead();
    console.log('✓ Todas las notificaciones marcadas como leídas:', resultado);
    return resultado;
  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  }
};

/**
 * Ejemplo 10: Eliminar notificación
 */
export const ejemploEliminarNotificacion = async (notificationId) => {
  try {
    const resultado = await deleteNotification(notificationId);
    console.log('✓ Notificación eliminada:', resultado);
    return resultado;
  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  }
};

// ============================================
// FLUJO COMPLETO DE EJEMPLO
// ============================================

/**
 * Flujo completo: Simular y gestionar notificaciones
 */
export const flujoCompleto = async (userDocumentNumber) => {
  console.log('🚀 Iniciando flujo completo de notificaciones...\n');

  try {
    // 1. Enviar notificación de bienvenida
    console.log('1️⃣ Enviando correo de bienvenida...');
    await sendWelcomeNotification(userDocumentNumber);
    console.log('   ✓ Bienvenida enviada\n');

    // 2. Enviar notificación de nueva actuación
    console.log('2️⃣ Enviando notificación de nueva actuación...');
    await sendNewActuationNotification({
      userDocumentNumber,
      numeroRadicacion: '50001333100120070007600',
      actuacion: 'Sentencia de primera instancia',
      fecha: new Date().toISOString().split('T')[0]
    });
    console.log('   ✓ Actuación notificada\n');

    // 3. Obtener notificaciones no leídas
    console.log('3️⃣ Obteniendo notificaciones no leídas...');
    const unread = await getUnreadNotifications();
    console.log(`   ✓ ${unread.length} notificaciones no leídas\n`);

    // 4. Contar no leídas
    console.log('4️⃣ Contando notificaciones no leídas...');
    const count = await getUnreadCount();
    console.log(`   ✓ Total: ${count}\n`);

    // 5. Marcar todas como leídas
    console.log('5️⃣ Marcando todas como leídas...');
    await markAllAsRead();
    console.log('   ✓ Todas marcadas como leídas\n');

    // 6. Verificar que ya no hay no leídas
    console.log('6️⃣ Verificando estado final...');
    const finalCount = await getUnreadCount();
    console.log(`   ✓ Notificaciones no leídas: ${finalCount}\n`);

    console.log('✅ Flujo completado exitosamente!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error en el flujo:', error.message);
    throw error;
  }
};

// ============================================
// HOOK PERSONALIZADO PARA REACT
// ============================================

/**
 * Custom Hook para gestionar notificaciones
 * Ejemplo de uso en un componente React
 */
export const useNotificationsExample = () => {
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  // Cargar notificaciones
  const loadNotifications = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyNotifications();
      setNotifications(data);
      
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Marcar como leída
  const markNotificationAsRead = React.useCallback(async (notificationId) => {
    try {
      await markAsRead(notificationId);
      await loadNotifications(); // Recargar
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  }, [loadNotifications]);

  // Eliminar notificación
  const removeNotification = React.useCallback(async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      await loadNotifications(); // Recargar
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    }
  }, [loadNotifications]);

  // Cargar al montar
  React.useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markNotificationAsRead,
    removeNotification
  };
};

// ============================================
// TESTS DE EJEMPLO
// ============================================

/**
 * Función para ejecutar todos los ejemplos
 * Útil para testing rápido
 */
export const ejecutarTodosLosEjemplos = async () => {
  console.log('🧪 EJECUTANDO SUITE DE EJEMPLOS\n');
  console.log('='.repeat(50) + '\n');

  const ejemplos = [
    { nombre: 'Bienvenida', fn: ejemploBienvenida },
    { nombre: 'Nueva Actuación', fn: ejemploNuevaActuacion },
    { nombre: 'Proceso Eliminado', fn: ejemploProcesoEliminado },
    { nombre: 'Recordatorio', fn: ejemploRecordatorio },
    { nombre: 'Obtener Notificaciones', fn: ejemploObtenerNotificaciones },
    { nombre: 'Obtener No Leídas', fn: ejemploObtenerNoLeidas },
    { nombre: 'Contar No Leídas', fn: ejemploContarNoLeidas },
  ];

  const resultados = {
    exitosos: 0,
    fallidos: 0,
    total: ejemplos.length
  };

  for (const ejemplo of ejemplos) {
    try {
      console.log(`\n📝 Ejecutando: ${ejemplo.nombre}`);
      await ejemplo.fn();
      resultados.exitosos++;
      console.log(`✅ ${ejemplo.nombre}: ÉXITO`);
    } catch (error) {
      resultados.fallidos++;
      console.log(`❌ ${ejemplo.nombre}: FALLÓ - ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 RESUMEN DE RESULTADOS:');
  console.log(`   Total: ${resultados.total}`);
  console.log(`   Exitosos: ${resultados.exitosos} ✅`);
  console.log(`   Fallidos: ${resultados.fallidos} ❌`);
  console.log(`   Tasa de éxito: ${((resultados.exitosos / resultados.total) * 100).toFixed(1)}%`);
  console.log('\n' + '='.repeat(50));

  return resultados;
};

export default {
  ejemploBienvenida,
  ejemploNuevaActuacion,
  ejemploProcesoEliminado,
  ejemploRecordatorio,
  ejemploObtenerNotificaciones,
  ejemploObtenerNoLeidas,
  ejemploContarNoLeidas,
  ejemploMarcarComoLeida,
  ejemploMarcarTodasLeidas,
  ejemploEliminarNotificacion,
  flujoCompleto,
  ejecutarTodosLosEjemplos
};
