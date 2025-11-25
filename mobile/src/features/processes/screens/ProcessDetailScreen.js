import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  obtenerDetalleProceso, 
  obtenerSujetosProceso, 
  obtenerActuacionesProceso,
  obtenerDocumentosProceso,
  guardarProceso 
} from '../services/ProcessAPI';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import ActivityChart from '../components/ActivityChart';

const TABS = [
  { key: 'datos', label: 'Datos', icon: 'information-circle-outline' },
  { key: 'sujetos', label: 'Sujetos', icon: 'people-outline' },
  { key: 'documentos', label: 'Documentos', icon: 'document-text-outline' },
  { key: 'actuaciones', label: 'Actuaciones', icon: 'list-outline' },
];

const ProcessDetailScreen = ({ route, navigation }) => {
  const { idProceso, llaveProceso } = route.params || {};
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('datos');
  
  const [detail, setDetail] = useState(null);
  const [sujetos, setSujetos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [actuaciones, setActuaciones] = useState([]);
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Cargar detalle
        const detailData = await obtenerDetalleProceso(idProceso);
        setDetail(detailData);

        // Cargar sujetos
        const sujetosData = await obtenerSujetosProceso(idProceso);
        setSujetos(Array.isArray(sujetosData) ? sujetosData : []);

        // Cargar actuaciones
        const actuacionesData = await obtenerActuacionesProceso(idProceso);
        if (Array.isArray(actuacionesData)) {
          const processedActuaciones = actuacionesData.map((a, i) => ({
            ...a,
            fechaMostrable: a.fechaActuacion ? new Date(a.fechaActuacion).toLocaleDateString() : '-',
            actuacionMostrable: a.actuacion || 'Sin descripción',
            anotacionMostrable: a.anotacion || '-',
          }));
          setActuaciones(processedActuaciones);
        } else {
          setActuaciones([]);
        }

        // Cargar documentos
        const docsData = await obtenerDocumentosProceso(idProceso);
        setDocumentos(Array.isArray(docsData) ? docsData : []);

      } catch (err) {
        console.error('Error cargando detalle:', err);
        setError('Error al cargar la información del proceso');
      } finally {
        setLoading(false);
      }
    };

    if (idProceso) {
      fetchData();
    }
  }, [idProceso]);

  const handleGuardar = async () => {
    setSaving(true);
    try {
      // Usar llaveProceso si está disponible, sino idProceso
      const procesoId = llaveProceso || idProceso;
      await guardarProceso(procesoId);
      Alert.alert('Éxito', 'Proceso guardado en "Mis Procesos".');
    } catch (err) {
      const errorMsg = err.response?.status === 409 || err.response?.status === 400
        ? 'Ya estás siguiendo este proceso.'
        : 'No se pudo guardar el proceso. Intenta de nuevo.';
      Alert.alert('Aviso', errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando detalle del proceso..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#DC2626" />
        <Text style={styles.errorTitle}>{error}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>{llaveProceso || idProceso}</Text>
          <Text style={styles.headerSubtitle}>Detalle del Proceso</Text>
        </View>
        <TouchableOpacity 
          onPress={handleGuardar} 
          disabled={saving}
          style={styles.saveBtn}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#D97706" />
          ) : (
            <Ionicons name="bookmark-outline" size={24} color="#D97706" />
          )}
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons 
              name={tab.icon} 
              size={14} 
              color={activeTab === tab.key ? '#D97706' : '#64748B'} 
            />
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'datos' && <DatosTab detail={detail} />}
        {activeTab === 'sujetos' && <SujetosTab sujetos={sujetos} />}
        {activeTab === 'documentos' && <DocumentosTab documentos={documentos} />}
        {activeTab === 'actuaciones' && <ActuacionesTab actuaciones={actuaciones} />}
      </ScrollView>
    </SafeAreaView>
  );
};

// Componentes de Tabs
const DatosTab = ({ detail }) => {
  if (!detail) {
    return (
      <View style={styles.emptyStateContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#CBD5E1" />
        <Text style={styles.emptyText}>No hay datos disponibles</Text>
      </View>
    );
  }

  const mainFields = [
    { 
      label: 'RADICACIÓN', 
      value: detail.llaveProceso || detail.idProceso,
      icon: 'document-text',
      highlight: true
    },
    { 
      label: 'DESPACHO', 
      value: detail.despacho,
      icon: 'business'
    },
  ];

  const locationFields = [
    { label: 'Departamento', value: detail.departamento, icon: 'location' },
    { label: 'Municipio', value: detail.municipio, icon: 'navigate' },
  ];

  const processFields = [
    { label: 'Clase', value: detail.clase, icon: 'pricetag' },
    { label: 'Tipo Proceso', value: detail.tipoProceso, icon: 'folder-open' },
    { label: 'Fecha Proceso', value: detail.fechaProceso ? new Date(detail.fechaProceso).toLocaleDateString() : '-', icon: 'calendar' },
    { label: 'Recurso', value: detail.recurso || '-', icon: 'document' },
  ];

  return (
    <ScrollView style={styles.tabContent}>
      {/* Main Info Cards */}
      {mainFields.map((field, idx) => (
        <View key={idx} style={[styles.mainCard, field.highlight && styles.highlightCard]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, field.highlight && styles.iconBadgeHighlight]}>
              <Ionicons 
                name={field.icon} 
                size={24} 
                color={field.highlight ? '#D97706' : '#64748B'} 
              />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>{field.label}</Text>
              <Text style={[styles.cardValue, field.highlight && styles.cardValueHighlight]}>
                {field.value || '-'}
              </Text>
            </View>
          </View>
        </View>
      ))}

      {/* Location Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name="location-outline" size={20} color="#D97706" />
          <Text style={styles.sectionTitle}>UBICACIÓN</Text>
        </View>
        <View style={styles.gridRow}>
          {locationFields.map((field, idx) => (
            <View key={idx} style={styles.gridColumn}>
              <View style={styles.gridItemContent}>
                <View style={styles.gridIconContainer}>
                  <Ionicons name={field.icon} size={16} color="#64748B" />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.gridLabel}>{field.label}</Text>
                  <Text style={styles.gridValue}>{field.value || '-'}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Process Info Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={20} color="#D97706" />
          <Text style={styles.sectionTitle}>INFORMACIÓN DEL PROCESO</Text>
        </View>
        {processFields.map((field, idx) => (
          <View key={idx} style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name={field.icon} size={16} color="#64748B" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{field.label}</Text>
              <Text style={styles.infoValue}>{field.value || '-'}</Text>
            </View>
          </View>
        ))}
      </View>

      {detail.contenidoInicial && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={20} color="#D97706" />
            <Text style={styles.sectionTitle}>CONTENIDO INICIAL</Text>
          </View>
          <Text style={styles.contenidoText}>{detail.contenidoInicial}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const SujetosTab = ({ sujetos }) => {
  if (!sujetos || sujetos.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <Ionicons name="people-outline" size={64} color="#CBD5E1" />
        <Text style={styles.emptyText}>No hay sujetos procesales</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.tabContent}>
      {sujetos.map((sujeto, idx) => {
        // Concatenar nombre completo de todos los campos disponibles
        const nombreCompleto = sujeto.nombreRazonSocial || 
                              sujeto.nombre || 
                              sujeto.nombreCompleto ||
                              'Sin nombre';

        // Tipo de parte con múltiples variaciones
        const tipoParte = sujeto.tipoSujeto || 
                         sujeto.tipoParte || 
                         sujeto.tipo || 
                         'No especificado';

        return (
        <View key={idx} style={[styles.mainCard, { borderLeftColor: '#0EA5E9' }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="person-circle" size={24} color="#0EA5E9" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>Nombre / Razón Social</Text>
              <Text style={styles.cardValue}>{nombreCompleto}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={[styles.infoIconContainer, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="briefcase-outline" size={18} color="#0EA5E9" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Tipo de Parte</Text>
              <Text style={styles.infoValue}>{tipoParte}</Text>
            </View>
          </View>
        </View>
        );
      })}
    </ScrollView>
  );
};

const DocumentosTab = ({ documentos }) => {
  if (!documentos || documentos.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <Ionicons name="document-text-outline" size={64} color="#CBD5E1" />
        <Text style={styles.emptyText}>No hay documentos disponibles</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.tabContent}>
      {documentos.map((doc, idx) => (
        <View key={idx} style={[styles.mainCard, { borderLeftColor: '#10B981' }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="document-text" size={24} color="#10B981" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>Documento</Text>
              <Text style={styles.cardValue} numberOfLines={2}>
                {doc.titulo || doc.nombre || 'Sin título'}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={[styles.infoIconContainer, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="calendar-outline" size={18} color="#10B981" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>
                {doc.fecha ? new Date(doc.fecha).toLocaleDateString() : 'Sin fecha'}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const ActuacionesTab = ({ actuaciones }) => {
  if (!actuaciones || actuaciones.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <Ionicons name="receipt-outline" size={64} color="#CBD5E1" />
        <Text style={styles.emptyText}>No hay actuaciones registradas</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.tabContent}>
      {/* Gráfica de Actividad */}
      <ActivityChart actuaciones={actuaciones} />

      {/* Título del listado */}
      <View style={styles.listHeader}>
        <Ionicons name="list" size={20} color="#8B5CF6" />
        <Text style={styles.listTitle}>Listado de Actuaciones</Text>
      </View>

      {/* Lista de actuaciones */}
      {actuaciones.map((act, idx) => (
        <View key={idx} style={[styles.mainCard, { borderLeftColor: '#8B5CF6' }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: '#EDE9FE' }]}>
              <Text style={[styles.actBadgeText, { color: '#8B5CF6' }]}>
                {idx + 1}
              </Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>
                {act.fechaMostrable || 'Sin fecha'}
              </Text>
              <Text style={styles.cardValue} numberOfLines={2}>
                {act.actuacionMostrable || 'Sin descripción'}
              </Text>
            </View>
          </View>
          {act.anotacionMostrable && act.anotacionMostrable !== '-' && (
            <View style={styles.infoRow}>
              <View style={[styles.infoIconContainer, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="information-circle" size={18} color="#8B5CF6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Anotación</Text>
                <Text style={styles.contenidoText}>{act.anotacionMostrable}</Text>
              </View>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 8 : 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  saveBtn: {
    padding: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#D97706',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tabsContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    maxHeight: 50,
  },
  tabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    gap: 4,
  },
  tabActive: {
    backgroundColor: '#FEF3C7',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#D97706',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
    paddingTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 12,
  },
  // New styles for enhanced DatosTab
  mainCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#E2E8F0',
  },
  highlightCard: {
    borderLeftColor: '#D97706',
    backgroundColor: '#FFFBEB',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeHighlight: {
    backgroundColor: '#FEF3C7',
  },
  actBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  cardValueHighlight: {
    color: '#D97706',
  },
  sectionContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridColumn: {
    flex: 1,
    minWidth: 0,
  },
  gridItemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  gridItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    minWidth: 0,
  },
  gridIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  contenidoText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyStateContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
});

export default ProcessDetailScreen;
