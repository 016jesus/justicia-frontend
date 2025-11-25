import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerHistorial } from '../services/ProcessAPI';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import Logo from '../../../components/Logo/Logo';

const ProcessHistoryScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerHistorial();
      const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
      setItems(sorted);
    } catch (err) {
      console.error('Error cargando historial:', err);
      setError('No se pudo cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleVerDetalle = (item) => {
    if (item.legalProcessId) {
      navigation.navigate('ProcessDetail', { 
        idProceso: item.legalProcessId,
        llaveProceso: item.radicacion || item.legalProcessId
      });
    }
  };

  if (loading && !refreshing) {
    return <LoadingSpinner text="Cargando historial..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D97706']} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Logo width={50} height={50} />
          <Text style={styles.title}>Historial de Consultas</Text>
          <Text style={styles.subtitle}>
            Registro completo de tu actividad reciente
          </Text>
        </View>

        {error && (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle" size={24} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!error && items.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>No hay consultas recientes</Text>
          </View>
        )}

        {!error && items.length > 0 && (
          <View style={styles.listContainer}>
            {items.map((item, index) => {
              const isFound = !!item.legalProcessId;
              return (
                <View key={item.id || index} style={styles.historyCard}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.statusBadge, isFound ? styles.statusFound : styles.statusNotFound]}>
                      <Ionicons 
                        name={isFound ? "checkmark-circle" : "close-circle"} 
                        size={16} 
                        color={isFound ? "#10B981" : "#EF4444"} 
                      />
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.radicacion}>
                        {item.radicacion || item.legalProcessId || 'Desconocido'}
                      </Text>
                      <Text style={styles.dateText}>
                        {item.date ? new Date(item.date).toLocaleString() : '-'}
                      </Text>
                    </View>
                  </View>

                  {isFound && (
                    <TouchableOpacity 
                      style={styles.viewButton}
                      onPress={() => handleVerDetalle(item)}
                    >
                      <Text style={styles.viewButtonText}>Ver Expediente</Text>
                      <Ionicons name="arrow-forward" size={16} color="#D97706" />
                    </TouchableOpacity>
                  )}

                  {!isFound && (
                    <View style={styles.notFoundBadge}>
                      <Text style={styles.notFoundText}>No encontrado</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
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
    marginBottom: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 12,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
  listContainer: {
    gap: 12,
  },
  historyCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusFound: {
    backgroundColor: '#D1FAE5',
  },
  statusNotFound: {
    backgroundColor: '#FEE2E2',
  },
  cardInfo: {
    flex: 1,
  },
  radicacion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: '#64748B',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  viewButtonText: {
    color: '#D97706',
    fontSize: 14,
    fontWeight: '600',
  },
  notFoundBadge: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  notFoundText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default ProcessHistoryScreen;
