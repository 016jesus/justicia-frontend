import React, { useEffect, useState, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from 'recharts';
import styles from './ActivityChart.module.css';

/* -------------------------
   🔧 Normalizador de Fechas
 --------------------------*/

function normalizarFecha(fechaStr) {
  if (!fechaStr) return null;
  if (!isNaN(Date.parse(fechaStr))) return fechaStr;

  const partes = fechaStr.split('/');
  if (partes.length === 3) {
    const [dd, mm, yyyy] = partes;
    if (dd.length && mm.length && yyyy.length) {
      return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }
  }

  const partes2 = fechaStr.split('-');
  if (partes2.length === 3) {
    const [dd, mm, yyyy] = partes2;
    if (dd.length && mm.length && yyyy.length) {
      return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }
  }

  return null;
}

/* -------------------------
   🎨 Tooltip Personalizado
 --------------------------*/
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>{data.mes}</div>
      <div className={styles.tooltipValue}>
        <strong>{data.cantidad}</strong> actuación{data.cantidad !== 1 ? 'es' : ''}
      </div>
      <div className={styles.tooltipHint}>
        💡 Clic para ver detalles
      </div>
    </div>
  );
};

/* -------------------------
   📦 Componente ActivityChart
 --------------------------*/

const ActivityChart = ({ actuaciones }) => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthActions, setMonthActions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);

  useEffect(() => {
    if (!actuaciones || actuaciones.length === 0) {
      setData([]);
      return;
    }

    const fechasProcesadas = actuaciones
      .map((a) => {
        let rawDate = a.fechaActuacion || a.fechaRegistro || a.date || a.fecha || a.fchActuacion;
        const fechaISO = normalizarFecha(rawDate);
        if (!fechaISO) return null;
        const fecha = new Date(fechaISO);
        if (isNaN(fecha.getTime())) return null;
        return fecha;
      })
      .filter(Boolean);

    if (fechasProcesadas.length === 0) {
      setData([]);
      return;
    }

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

    const datosGrafica = Object.entries(mapaMeses)
      .map(([mes, cantidad]) => ({
        mes,
        cantidad,
        acciones: accionesPorMes[mes]
      }))
      .sort((a, b) => a.mes.localeCompare(b.mes));

    setData(datosGrafica);
  }, [actuaciones]);

  const handleBarClick = useCallback((entry) => {
    if (entry && entry.acciones) {
      setSelectedMonth(entry.mes);
      setMonthActions(entry.acciones);
      setShowModal(true);
    }
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedMonth(null);
    setMonthActions([]);
  }, []);

  if (data.length === 0) {
    return (
      <div className={styles.chartCard}>
        <div className={styles.header}>
          <h3 className={styles.title}>Actividad del Proceso</h3>
          <p className={styles.subtitle}>Distribución mensual de actuaciones</p>
        </div>
        <div className={styles.emptyState}>
          <span style={{ fontSize: '2.5rem', opacity: 0.3 }}>📊</span>
          <p>Sin actividad registrada</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.chartCard}>
        <div className={styles.header}>
          <h3 className={styles.title}>Actividad del Proceso</h3>
          <p className={styles.subtitle}>
            {data.length} meses con actividad • Total: {data.reduce((sum, d) => sum + d.cantidad, 0)} actuaciones
          </p>
        </div>

        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 20, left: 0, bottom: 50 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--color-borde)" 
                opacity={0.3}
              />
              <XAxis 
                dataKey="mes" 
                tick={{ 
                  fontSize: 11, 
                  fill: 'var(--color-texto-secundario)' 
                }}
                stroke="var(--color-borde)"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                allowDecimals={false}
                tick={{ 
                  fontSize: 12, 
                  fill: 'var(--color-texto-secundario)' 
                }}
                stroke="var(--color-borde)"
                tickMargin={8}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="cantidad" 
                radius={[8, 8, 0, 0]}
                onClick={handleBarClick}
                onMouseEnter={(_, index) => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
                style={{ cursor: 'pointer' }}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={
                      selectedMonth === entry.mes 
                        ? 'var(--brand-primary)' 
                        : hoveredBar === index
                        ? 'var(--brand-accent)'
                        : 'var(--brand-accent-hover)'
                    }
                    opacity={hoveredBar === null || hoveredBar === index ? 1 : 0.6}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal mejorado */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>
                  📅 Actuaciones de {selectedMonth}
                </h3>
                <p className={styles.modalSubtitle}>
                  Total: {monthActions.length} actuación{monthActions.length !== 1 ? 'es' : ''}
                </p>
              </div>
              <button onClick={closeModal} className={styles.modalClose}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {monthActions.map((accion, idx) => (
                <div key={idx} className={styles.actionCard}>
                  <div className={styles.actionTitle}>
                    {accion.actuacion || 'Actuación sin título'}
                  </div>
                  <div className={styles.actionDate}>
                    {(() => {
                      const rawDate = accion.fechaActuacion || accion.fechaRegistro || accion.date || accion.fecha;
                      if (!rawDate) return 'Fecha no disponible';
                      const fecha = new Date(normalizarFecha(rawDate) || rawDate);
                      return isNaN(fecha.getTime()) ? 'Fecha inválida' : fecha.toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      });
                    })()}
                  </div>
                  {(accion.anotacion || accion.descripcion) && (
                    <div className={styles.actionDescription}>
                      {accion.anotacion || accion.descripcion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(ActivityChart);