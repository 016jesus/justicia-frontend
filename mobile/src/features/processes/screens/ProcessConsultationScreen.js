import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { consultarProceso } from '../services/ProcessAPI';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import Logo from '../../../components/Logo/Logo';
import { useAuth } from '../../../context/AuthContext';
import { getUnreadCount } from '../../../services/NotificationService';
import NotificationSimulatorModal from '../components/NotificationSimulatorModal';

const ProcessConsultationScreen = ({ navigation }) => {
  const { logout, user } = useAuth();
  const [radicacion, setRadicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);

  // Cargar contador de notificaciones cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      loadUnreadCount();
    }, [])
  );

  const loadUnreadCount = async () => {
    const count = await getUnreadCount();
    setUnreadCount(count);
  };

  const handleNotificationSuccess = async () => {
    await loadUnreadCount();
  };

  const handleConsultar = async () => {
    if (!radicacion.trim()) {
      Alert.alert('Error', 'Por favor ingresa un número de radicación');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await consultarProceso(radicacion);
      
      if (data && Array.isArray(data.procesos)) {
        setResults(data.procesos);
        if (data.procesos.length === 0) {
          setError('No se encontraron resultados para esta radicación');
        }
      } else {
        setError('Respuesta inesperada del servidor');
      }
    } catch (err) {
      console.error('Error en consulta:', err);
      
      // Manejo específico de errores
      let errorMsg = 'Error al consultar el proceso';
      
      if (err.response) {
        const status = err.response.status;
        
        if (status === 503) {
          errorMsg = 'El servicio está temporalmente no disponible. Por favor intenta de nuevo en unos momentos.';
        } else if (status === 500) {
          errorMsg = 'Error interno del servidor. Por favor intenta de nuevo más tarde.';
        } else if (status === 404) {
          errorMsg = 'No se encontró información para este número de radicación.';
        } else if (status === 403) {
          errorMsg = 'No tienes permisos para acceder a esta información.';
        } else if (status === 401) {
          errorMsg = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
        } else {
          errorMsg = err.response.data?.message || `Error del servidor (${status})`;
        }
      } else if (err.message === 'Network Error') {
        errorMsg = 'Sin conexión a internet. Verifica tu conexión y vuelve a intentar.';
      }
      
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    setRadicacion('');
    setResults([]);
    setError(null);
  };

  const handleLogout = async () => {
    await logout(navigation.navigate);
  };

  const handleVerDetalle = (proceso) => {
    navigation.navigate('ProcessDetail', { 
      idProceso: proceso.idProceso,
      llaveProceso: proceso.llaveProceso 
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header con Logo y navegación */}
        <View style={styles.header}>
          <Logo width={60} height={60} />
          <Text style={styles.welcomeText}>Hola, {user?.firstName || 'Usuario'}</Text>
          
          {/* Botones de acción superior */}
          <View style={styles.topActions}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => setShowSimulatorModal(true)}
            >
              <Ionicons name="flash-outline" size={24} color="#D97706" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color="#0F172A" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Menú de navegación */}
          <View style={styles.menuNav}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigation.navigate('ProcessHistory')}
            >
              <Ionicons name="time-outline" size={20} color="#0F172A" />
              <Text style={styles.navButtonText}>Historial</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigation.navigate('MyProcesses')}
            >
              <Ionicons name="folder-open-outline" size={20} color="#0F172A" />
              <Text style={styles.navButtonText}>Mis Procesos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              <Text style={[styles.navButtonText, {color: '#DC2626'}]}>Salir</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.title}>Consulta de Procesos</Text>
        <Text style={styles.subtitle}>
          Ingresa el número de radicación para buscar información judicial
        </Text>

        {/* Card de Formulario */}
        <View style={styles.card}>
          <Text style={styles.label}>Número de radicación</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="search" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ej. 50001333100120070007600"
              value={radicacion}
              onChangeText={setRadicacion}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.button, styles.buttonPrimary, loading && styles.buttonDisabled]} 
              onPress={handleConsultar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Ionicons name="search" size={20} color="#FFF" />
                  <Text style={styles.buttonTextPrimary}>Consultar</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.buttonSecondary]} 
              onPress={handleLimpiar}
            >
              <Ionicons name="trash-outline" size={20} color="#0F172A" />
              <Text style={styles.buttonTextSecondary}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle" size={24} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Resultados */}
        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>
              {results.length} {results.length === 1 ? 'Resultado' : 'Resultados'}
            </Text>
            {results.map((proceso) => (
              <View key={proceso.idProceso} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={styles.resultBadge}>
                    <Ionicons name="document-text" size={16} color="#D97706" />
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultTitle}>{proceso.llaveProceso}</Text>
                    <Text style={styles.resultSubtitle}>{proceso.despacho}</Text>
                    <Text style={styles.resultMeta}>
                      {proceso.departamento} • {proceso.municipio}
                    </Text>
                  </View>
                </View>

                <View style={styles.resultDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Clase:</Text>
                    <Text style={styles.detailValue}>{proceso.clase || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tipo:</Text>
                    <Text style={styles.detailValue}>{proceso.tipoProceso || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Fecha:</Text>
                    <Text style={styles.detailValue}>
                      {proceso.fechaProceso ? new Date(proceso.fechaProceso).toLocaleDateString() : 'N/A'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.detailButton}
                  onPress={() => handleVerDetalle(proceso)}
                >
                  <Text style={styles.detailButtonText}>Ver Detalle Completo</Text>
                  <Ionicons name="arrow-forward" size={20} color="#D97706" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!loading && !error && results.length === 0 && radicacion === '' && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>Ingresa un número de radicación para comenzar</Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Simulación de Notificaciones */}
      <NotificationSimulatorModal
        visible={showSimulatorModal}
        onClose={() => setShowSimulatorModal(false)}
        onSuccess={handleNotificationSuccess}
        user={user}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 12,
  },
  topActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  menuNav: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0F172A',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: '#D97706',
  },
  buttonSecondary: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextPrimary: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '600',
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  errorText: {
    flex: 1,
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  resultsContainer: {
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  resultCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  resultBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  resultMeta: {
    fontSize: 12,
    color: '#94A3B8',
  },
  resultDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    gap: 8,
  },
  detailButtonText: {
    color: '#D97706',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export default ProcessConsultationScreen;
