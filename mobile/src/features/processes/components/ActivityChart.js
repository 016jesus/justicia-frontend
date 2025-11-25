import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 60;
const CHART_HEIGHT = 250;
const BAR_SPACING = 8;

/**
 * Normalizar fechas de diferentes formatos
 */
const normalizarFecha = (fechaStr) => {
  if (!fechaStr) return null;

  // Si ya es ISO válido
  if (!isNaN(Date.parse(fechaStr))) {
    return fechaStr;
  }

  // Intentar formato DD/MM/YYYY
  const partes = fechaStr.split('/');
  if (partes.length === 3) {
    const [dd, mm, yyyy] = partes;
    if (dd.length && mm.length && yyyy.length) {
      return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }
  }

  // Intentar formato DD-MM-YYYY
  const partes2 = fechaStr.split('-');
  if (partes2.length === 3) {
    const [dd, mm, yyyy] = partes2;
    if (dd.length && mm.length && yyyy.length) {
      return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }
  }

  return null;
};

const ActivityChart = ({ actuaciones, onMonthClick }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [monthActions, setMonthActions] = useState([]);

  // Procesar datos para la gráfica
  const chartData = useMemo(() => {
    if (!actuaciones || actuaciones.length === 0) {
      return [];
    }

    // Extraer y normalizar fechas
    const fechasProcesadas = actuaciones
      .map((a) => {
        const rawDate =
          a.fechaActuacion ||
          a.fechaRegistro ||
          a.date ||
          a.fecha ||
          a.fchActuacion;

        const fechaISO = normalizarFecha(rawDate);
        if (!fechaISO) return null;

        const fecha = new Date(fechaISO);
        if (isNaN(fecha.getTime())) return null;

        return fecha;
      })
      .filter(Boolean);

    if (fechasProcesadas.length === 0) {
      return [];
    }

    // Agrupar por mes
    const mapaMeses = {};
    const accionesPorMes = {};

    actuaciones.forEach((accion, idx) => {
      const fecha = fechasProcesadas[idx];
      if (!fecha) return;

      const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;

      if (!mapaMeses[key]) {
        mapaMeses[key] = 0;
        accionesPorMes[key] = [];
      }
      mapaMeses[key]++;
      accionesPorMes[key].push(accion);
    });

    // Generar datos para la gráfica
    const datosGrafica = Object.entries(mapaMeses)
      .map(([mes, cantidad]) => ({
        mes,
        mesLabel: mes.substring(5) + '/' + mes.substring(0, 4), // MM/YYYY
        cantidad,
        acciones: accionesPorMes[mes],
      }))
      .sort((a, b) => a.mes.localeCompare(b.mes));

    return datosGrafica;
  }, [actuaciones]);

  const handleBarPress = (entry) => {
    setSelectedMonth(entry.mes);
    setMonthActions(entry.acciones);
    setShowModal(true);
    if (onMonthClick) {
      onMonthClick({ dateKey: entry.mes });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMonth(null);
    setMonthActions([]);
  };

  if (chartData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bar-chart-outline" size={48} color="#CBD5E1" />
        <Text style={styles.emptyText}>Sin actividad registrada</Text>
      </View>
    );
  }

  // Calcular escalas
  const maxValue = Math.max(...chartData.map((d) => d.cantidad));
  const barWidth = Math.max(
    30,
    (CHART_WIDTH - chartData.length * BAR_SPACING) / chartData.length
  );
  const chartContentWidth = chartData.length * (barWidth + BAR_SPACING);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Actividad por Mes</Text>
          <Text style={styles.subtitle}>
            {chartData.length} mes(es) con actividad • {actuaciones.length} actuaciones
          </Text>
        </View>
        <Ionicons name="bar-chart" size={24} color="#D97706" />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        <View style={{ width: Math.max(CHART_WIDTH, chartContentWidth) }}>
          <Svg width={Math.max(CHART_WIDTH, chartContentWidth)} height={CHART_HEIGHT}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = CHART_HEIGHT - 50 - ratio * (CHART_HEIGHT - 70);
              return (
                <Line
                  key={`grid-${idx}`}
                  x1="0"
                  y1={y}
                  x2={Math.max(CHART_WIDTH, chartContentWidth)}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              );
            })}

            {/* Barras */}
            {chartData.map((entry, idx) => {
              const barHeight = ((entry.cantidad / maxValue) * (CHART_HEIGHT - 70));
              const x = idx * (barWidth + BAR_SPACING);
              const y = CHART_HEIGHT - 50 - barHeight;
              const isSelected = selectedMonth === entry.mes;

              return (
                <React.Fragment key={entry.mes}>
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={isSelected ? '#0F172A' : '#D97706'}
                    rx={4}
                    onPress={() => handleBarPress(entry)}
                  />
                  {/* Valor encima de la barra */}
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 5}
                    fontSize="12"
                    fontWeight="600"
                    fill="#0F172A"
                    textAnchor="middle"
                  >
                    {entry.cantidad}
                  </SvgText>
                  {/* Label del mes */}
                  <SvgText
                    x={x + barWidth / 2}
                    y={CHART_HEIGHT - 30}
                    fontSize="10"
                    fill="#64748B"
                    textAnchor="middle"
                    transform={`rotate(-45 ${x + barWidth / 2} ${CHART_HEIGHT - 30})`}
                  >
                    {entry.mesLabel}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>

          {/* Botones invisibles para mejorar el touch (overlay) */}
          <View style={{ position: 'absolute', flexDirection: 'row', top: 0 }}>
            {chartData.map((entry, idx) => {
              const barHeight = ((entry.cantidad / maxValue) * (CHART_HEIGHT - 70));
              const x = idx * (barWidth + BAR_SPACING);
              const y = CHART_HEIGHT - 50 - barHeight;

              return (
                <TouchableOpacity
                  key={`touch-${entry.mes}`}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: barWidth,
                    height: barHeight,
                  }}
                  onPress={() => handleBarPress(entry)}
                  activeOpacity={0.7}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Modal de actuaciones del mes */}
      <Modal visible={showModal} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Actuaciones de {selectedMonth}</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Total: {monthActions.length} actuación(es)
            </Text>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {monthActions.map((accion, idx) => {
                const rawDate =
                  accion.fechaActuacion ||
                  accion.fechaRegistro ||
                  accion.date ||
                  accion.fecha;
                let fechaFormateada = 'Fecha no disponible';
                if (rawDate) {
                  const fecha = new Date(normalizarFecha(rawDate) || rawDate);
                  if (!isNaN(fecha.getTime())) {
                    fechaFormateada = fecha.toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    });
                  }
                }

                return (
                  <View key={idx} style={styles.actionCard}>
                    <View style={styles.actionBadge}>
                      <Text style={styles.actionBadgeText}>{idx + 1}</Text>
                    </View>
                    <View style={styles.actionContent}>
                      <Text style={styles.actionTitle}>
                        {accion.actuacion || accion.actuacionMostrable || 'Actuación sin título'}
                      </Text>
                      <Text style={styles.actionDate}>{fechaFormateada}</Text>
                      {(accion.anotacion || accion.descripcion) && (
                        <Text style={styles.actionDescription}>
                          {accion.anotacion || accion.descripcion}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  emptyContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#94A3B8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  modalScroll: {
    maxHeight: 400,
  },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  actionDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  actionDescription: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  modalCloseButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default ActivityChart;
