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

/* -------------------------
   🔧 Normalizador de Fechas
 --------------------------*/

function normalizarFecha(fechaStr) {
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
}

/* -------------------------
   📦 Componente ActivityChart
 --------------------------*/

const ActivityChart = ({ actuaciones }) => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthActions, setMonthActions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!actuaciones || actuaciones.length === 0) {
      setData([]);
      return;
    }

    /* -------------------------
       1️⃣ Convertir y normalizar fechas
     --------------------------*/
    const fechasProcesadas = actuaciones
      .map((a) => {
        let rawDate =
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
      setData([]);
      return;
    }

    /* -------------------------
       2️⃣ Agrupar por mes
     --------------------------*/
    const mapaMeses = {};
    const accionesPorMes = {};

    actuaciones.forEach((accion, idx) => {
      const fecha = fechasProcesadas[idx];
      if (!fecha) return;

      const key = `${fecha.getFullYear()}-${String(
        fecha.getMonth() + 1
      ).padStart(2, '0')}`;

      if (!mapaMeses[key]) {
        mapaMeses[key] = 0;
        accionesPorMes[key] = [];
      }
      mapaMeses[key]++;
      accionesPorMes[key].push(accion);
    });

    /* -------------------------
       3️⃣ Generar datos para Recharts
     --------------------------*/
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

  /* -------------------------
     4️⃣ Si no hay datos → mensaje vacío
   --------------------------*/
  if (data.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#666'
        }}
      >
        Sin actividad registrada.
      </div>
    );
  }

  /* -------------------------
     5️⃣ Render de la gráfica
   --------------------------*/
  return (
    <>
      <div style={{ 
        width: '100%',
        height: '320px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0'
      }}>
        <div style={{ width: '95%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 15, left: 0, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="mes" 
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              allowDecimals={false}
              tick={{ fontSize: 12 }}
              tickMargin={8}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
              cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
            />
            <Bar 
              dataKey="cantidad" 
              radius={[6, 6, 0, 0]}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={selectedMonth === entry.mes ? 'var(--brand-secondary, #1A2B45)' : 'var(--brand-primary, #D4AF37)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* Modal de actuaciones del mes */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={closeModal}
        >
          <div 
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '12px'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '20px',
                color: 'var(--brand-secondary, #1A2B45)'
              }}>
                Actuaciones de {selectedMonth}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6B7280',
                  padding: '0 8px',
                  lineHeight: 1
                }}
                title="Cerrar"
              >
                ×
              </button>
            </div>

            <div style={{ 
              fontSize: '14px',
              color: '#6B7280',
              marginBottom: '16px'
            }}>
              Total: {monthActions.length} actuación(es)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {monthActions.map((accion, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '14px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB'
                  }}
                >
                  <div style={{ 
                    fontWeight: 600, 
                    marginBottom: '6px',
                    color: 'var(--brand-secondary, #1A2B45)'
                  }}>
                    {accion.actuacion || 'Actuación sin título'}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: '#6B7280',
                    marginBottom: '8px'
                  }}>
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
                    <div style={{ 
                      fontSize: '14px',
                      lineHeight: '1.5',
                      color: '#374151'
                    }}>
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
