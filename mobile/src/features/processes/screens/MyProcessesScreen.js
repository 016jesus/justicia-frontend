import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerMisProcesos, eliminarProceso } from '../services/ProcessAPI';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import Logo from '../../../components/Logo/Logo';

const MyProcessesScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState({});

  const fetchProcesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerMisProcesos();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando mis procesos:', err);
      setError('No se pudieron cargar los procesos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProcesses();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const handleDelete = (item) => {
    const id = item?.legalProcessId;
    if (!id) return;

    Alert.alert(
      'Eliminar Proceso',
      `¿Estás seguro de eliminar el proceso ${id}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setDeleting(prev => ({ ...prev, [id]: true }));
            try {
              await eliminarProceso(id);
              setItems(prev => prev.filter(x => x.legalProcessId !== id));
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar el proceso');
            } finally {
              setDeleting(prev => ({ ...prev, [id]: false }));
            }
          },
        },
      ]
    );
  };

  const handleVerDetalle = (item) => {
    navigation.navigate('ProcessDetail', { 
      idProceso: item.legalProcessId,
      llaveProceso: item.legalProcessId
    });
  };

  if (loading && !refreshing) {
    return <LoadingSpinner text="Cargando tus procesos..." />;
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
          <Text style={styles.title}>Mis Procesos</Text>
          <Text style={styles.subtitle}>
            Monitorea tus expedientes judiciales guardados
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
            <Ionicons name="folder-open-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>No tienes procesos guardados</Text>
            <Text style={styles.emptySubtext}>Consulta un proceso y guárdalo para verlo aquí</Text>
          </View>
        )}

        {!error && items.length > 0 && (
          <View style={styles.listContainer}>
            {items.map((item) => (
              <View key={item.legalProcessId} style={styles.processCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconBadge}>
                    <Ionicons name="document-text" size={20} color="#D97706" />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.processId}>{item.legalProcessId}</Text>
                    <View style={styles.metaRow}>
                      <Ionicons name="calendar-outline" size={14} color="#64748B" />
                      <Text style={styles.metaText}>
                        Última Actuación: {item.lastActionDate ? new Date(item.lastActionDate).toLocaleDateString() : 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Ionicons name="time-outline" size={14} color="#64748B" />
                      <Text style={styles.metaText}>
                        Guardado: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => handleVerDetalle(item)}
                  >
                    <Ionicons name="eye" size={18} color="#FFF" />
                    <Text style={styles.viewButtonText}>Ver</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item)}
                    disabled={deleting[item.legalProcessId]}
                  >
                    {deleting[item.legalProcessId] ? (
                      <ActivityIndicator size="small" color="#DC2626" />
                    ) : (
                      <>
                        <Ionicons name="trash" size={18} color="#DC2626" />
                        <Text style={styles.deleteButtonText}>Eliminar</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
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
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
  },
  listContainer: {
    gap: 12,
  },
  processCard: {
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
    marginBottom: 16,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  processId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D97706',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  viewButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MyProcessesScreen;
