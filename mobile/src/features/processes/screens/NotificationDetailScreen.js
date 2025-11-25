import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { markAsRead } from '../../../services/NotificationsAPI';

const NotificationDetailScreen = ({ route, navigation }) => {
  const { notification } = route.params;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Marcar como leída al abrir
    if (!notification.read) {
      handleMarkAsRead();
    }
  }, []);

  const handleMarkAsRead = async () => {
    try {
      if (notification.id) {
        await markAsRead(notification.id);
      }
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  };

  const handleGoToProcess = () => {
    if (notification.data?.processNumber) {
      navigation.navigate('ProcessDetail', {
        processId: notification.data.processNumber
      });
    } else {
      Alert.alert('Información', 'No hay proceso asociado a esta notificación');
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'welcome':
        return { name: 'mail', color: '#10B981' };
      case 'new-actuation':
        return { name: 'newspaper', color: '#0EA5E9' };
      case 'process-deleted':
        return { name: 'trash', color: '#EF4444' };
      case 'reminder':
        return { name: 'time', color: '#D97706' };
      case 'process-update':
        return { name: 'refresh', color: '#8B5CF6' };
      default:
        return { name: 'notifications', color: '#0F172A' };
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const icon = getIconForType(notification.data?.type || notification.type);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Notificación</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Icono y Tipo */}
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: icon.color + '20' }]}>
            <Ionicons name={icon.name} size={48} color={icon.color} />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>{notification.title}</Text>

        {/* Fecha */}
        <View style={styles.dateContainer}>
          <Ionicons name="time-outline" size={16} color="#64748B" />
          <Text style={styles.date}>{formatDate(notification.timestamp)}</Text>
        </View>

        {/* Badge de estado */}
        {!notification.read && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>No leída</Text>
          </View>
        )}

        {/* Separador */}
        <View style={styles.divider} />

        {/* Contenido */}
        <View style={styles.bodySection}>
          <Text style={styles.sectionTitle}>Mensaje</Text>
          <Text style={styles.body}>{notification.body}</Text>
        </View>

        {/* Información adicional */}
        {notification.data && (
          <>
            <View style={styles.divider} />
            <View style={styles.dataSection}>
              <Text style={styles.sectionTitle}>Información Adicional</Text>
              
              {notification.data.processNumber && (
                <View style={styles.dataRow}>
                  <Ionicons name="document-text" size={20} color="#D97706" />
                  <View style={styles.dataContent}>
                    <Text style={styles.dataLabel}>Proceso</Text>
                    <Text style={styles.dataValue}>{notification.data.processNumber}</Text>
                  </View>
                </View>
              )}

              {notification.data.actuacion && (
                <View style={styles.dataRow}>
                  <Ionicons name="information-circle" size={20} color="#0EA5E9" />
                  <View style={styles.dataContent}>
                    <Text style={styles.dataLabel}>Actuación</Text>
                    <Text style={styles.dataValue}>{notification.data.actuacion}</Text>
                  </View>
                </View>
              )}

              {notification.data.fecha && (
                <View style={styles.dataRow}>
                  <Ionicons name="calendar" size={20} color="#10B981" />
                  <View style={styles.dataContent}>
                    <Text style={styles.dataLabel}>Fecha</Text>
                    <Text style={styles.dataValue}>{notification.data.fecha}</Text>
                  </View>
                </View>
              )}

              {notification.data.count && (
                <View style={styles.dataRow}>
                  <Ionicons name="list" size={20} color="#8B5CF6" />
                  <View style={styles.dataContent}>
                    <Text style={styles.dataLabel}>Cantidad de procesos</Text>
                    <Text style={styles.dataValue}>{notification.data.count}</Text>
                  </View>
                </View>
              )}

              {notification.data.type && (
                <View style={styles.dataRow}>
                  <Ionicons name="pricetag" size={20} color="#64748B" />
                  <View style={styles.dataContent}>
                    <Text style={styles.dataLabel}>Tipo</Text>
                    <Text style={styles.dataValue}>{notification.data.type}</Text>
                  </View>
                </View>
              )}
            </View>
          </>
        )}

        {/* Botón para ir al proceso */}
        {notification.data?.processNumber && (
          <TouchableOpacity 
            style={styles.processButton}
            onPress={handleGoToProcess}
          >
            <Ionicons name="folder-open" size={20} color="#FFF" />
            <Text style={styles.processButtonText}>Ver Proceso Completo</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    color: '#64748B',
  },
  unreadBadge: {
    alignSelf: 'center',
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 24,
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 24,
  },
  bodySection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
  },
  dataSection: {
    marginBottom: 8,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dataContent: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  dataValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  processButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D97706',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
    elevation: 2,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  processButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default NotificationDetailScreen;
