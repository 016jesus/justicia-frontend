import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // <--- 1. IMPORTANTE: Importar useNavigate
import { FaPrint, FaBookmark, FaExclamationCircle, FaTimes, FaArrowLeft } from 'react-icons/fa';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import apiClient from '../../../services/APIClient';
import { cachedGet, invalidateCacheByPrefix } from '../../../services/cachedApi';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import ActivityChart from '../components/Graphics/ActivityChart'; 
import tableStyles from '../components/ConsultationForm/Table.module.css'; 
import styles from './ProcessDetail.module.css';

const tabs = [
  { key: 'datos', label: 'DATOS DEL PROCESO' },
  { key: 'sujetos', label: 'SUJETOS PROCESALES' },
  { key: 'documentos', label: 'DOCUMENTOS' },
  { key: 'actuaciones', label: 'ACTUACIONES Y GRÁFICA' },
];

const DataContentTable = React.memo(({ headers, data, loading, error, emptyMsg }) => {
  if (loading) return <LoadingSpinner size="small" text="Cargando datos..." />;
  if (error) return <div className="errorBox">{error}</div>;
  if (!data || data.length === 0) return <div style={{padding: 20, color: '#666', fontStyle: 'italic'}}>{emptyMsg}</div>;

  return (
    <div className={tableStyles.tableWrapper}>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className={tableStyles.table}>
          <thead>
            <tr className={tableStyles.tr}>
              {headers.map((h) => <th key={h.key} className={tableStyles.th}>{h.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row._key || idx} className={tableStyles.tr}>
                {headers.map((h) => (
                  <td key={h.key} className={tableStyles.td}>
                    {row[h.key] || <span style={{color:'#9CA3AF'}}>-</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const ProcessDetailPage = () => {
  const { idProceso } = useParams();
  const navigate = useNavigate(); 
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [detail, setDetail] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [actions, setActions] = useState([]);
  
  const [activeTab, setActiveTab] = useState('datos');
  const [filtroMes, setFiltroMes] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      // 1. Cargar Detalle (Fundamental)
      try {
        const resDetail = await cachedGet(`/api/legal-processes/${encodeURIComponent(idProceso)}/detail`);
        setDetail(resDetail?.data || null);
      } catch (err) {
        console.error("Error cargando detalle:", err);
        setError('Error cargando información básica del proceso.');
      }

      // 2. Cargar Sujetos
      try {
        const resSubjects = await cachedGet(`/api/legal-processes/${encodeURIComponent(idProceso)}/subjects`);
        setSubjects((resSubjects?.data?.sujetos || resSubjects?.data || []).map((s, i) => ({ ...s, _key: i })));
      } catch (err) {
        console.warn("Error cargando sujetos (no crítico):", err);
      }

      // 3. Cargar Actuaciones (IMPORTANTE: Lo movemos ANTES de documentos o en su propio bloque para asegurar la gráfica)
      try {
        const resActions = await cachedGet(`/api/legal-processes/${encodeURIComponent(idProceso)}/actuaciones`, {}, { ttlMs: 60000 });
        const rawActions = resActions?.data?.actuaciones || resActions?.data || [];
        
        const processedActions = rawActions.map((a, i) => {
            const rawDate = a.fechaActuacion || a.fechaRegistro || a.date; 
            return {
                ...a,
                _key: a.idRegActuacion || a.consActuacion || i,
                fechaActuacion: rawDate,
                fechaMostrable: rawDate ? new Date(rawDate).toLocaleDateString() : '-',
                actuacionMostrable: a.actuacion || a.description || 'Sin descripción',
                anotacionMostrable: a.anotacion || a.annotation || '-',
                conDocs: a.conDocumentos ? 'Sí' : 'No'
            };
        });
        setActions(processedActions);
      } catch (err) {
        console.error("Error cargando actuaciones:", err);
        // Aquí no seteamos error global para que al menos se vea el encabezado
      }

      // 4. Cargar Documentos (Este es el que suele fallar con 404)
      try {
        const resDocs = await cachedGet(`/api/legal-processes/${encodeURIComponent(idProceso)}/documents`);
        const docsData = resDocs?.data?.documentos || resDocs?.data || [];
        setDocuments(docsData.map((d, i) => ({
             _key: i,
             fecha: d.fecha ? new Date(d.fecha).toLocaleDateString() : '-',
             tipo: d.tipoDocumento || '-',
             nombre: d.titulo || d.nombre || '-',
             descripcion: d.descripcion || '-'
        })));
      } catch (err) {
        // Si es 404, simplemente asumimos que no hay documentos y no rompemos nada
        console.warn("No se encontraron documentos (404) o hubo error:", err);
        setDocuments([]); 
      } finally {
        // Apagamos el loading al final de todo
        setLoading(false);
      }
    };

    if (idProceso) fetchAllData();
  }, [idProceso]);

  const handleChartClick = useCallback((dataMes) => {
    if (dataMes?.dateKey) {
      setFiltroMes(dataMes.dateKey);
      setTimeout(() => {
          document.getElementById('tabla-actuaciones')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, []);

  const actuacionesFiltradas = useMemo(() => {
    if (!filtroMes) return actions;
    return actions.filter(act => {
      const fecha = new Date(act.fechaActuacion);
      if (isNaN(fecha.getTime())) return false;
      const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      return key === filtroMes;
    });
  }, [actions, filtroMes]);

  const handleAssociate = useCallback(async () => {
     try {
       const numero = detail?.llaveProceso || idProceso;
       await apiClient.post(`/api/legal-processes/${encodeURIComponent(numero)}`);
       alert('Proceso guardado en "Mis Procesos".');
       invalidateCacheByPrefix('/api/legal-processes');
     } catch (e) {
       alert('Ya estás siguiendo este proceso o hubo un error.');
     }
  }, [detail, idProceso]);

  return (
    <DashboardLayout activeItem="consultar">
      <div className={styles.pageWrapper}>

        <div className={styles.backButton}>
          <button 
            className="btn btn-ghost" 
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft /> Volver a resultados
          </button>
        </div>

        {loading && <LoadingSpinner text="Cargando expediente..." />}
        {error && <div className="errorBox"><FaExclamationCircle/> {error}</div>}

        {detail && !loading && (
          <>
            <div className={styles.summaryCard}>
              <h2 className={styles.radicacionTitle}>{detail.llaveProceso}</h2>
              <p className={styles.radicacionSubtitle}>
                {detail.despacho} • {detail.ubicacion}
              </p>
              
              <div className={styles.dataGrid}>
                <div><strong>Clase:</strong> {detail.claseProceso}</div>
                <div><strong>Ponente:</strong> {detail.ponente}</div>
                <div><strong>Estado:</strong> {detail.estadoProceso || 'Activo'}</div>
                <div><strong>Última Act.:</strong> {detail.fechaUltimaActuacion ? new Date(detail.fechaUltimaActuacion).toLocaleDateString() : '-'}</div>
              </div>

              <div className={`no-print ${styles.buttonGroup}`}>
                <button className="btn btn-primary" onClick={handleAssociate}>
                  <FaBookmark /> Seguir Proceso
                </button>
                <button className="btn btn-secondary" onClick={() => window.print()}>
                  <FaPrint /> Imprimir
                </button>
              </div>
            </div>

            <div className={`no-print ${styles.tabContainer}`}>
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className={styles.tabContentCard}>
              {activeTab === 'datos' && (
                <div>
                  <h3>Información General</h3>
                  <div className={styles.dataGridFull}>
                     <div><strong>Tipo:</strong> {detail.tipoProceso}</div>
                     <div><strong>Subclase:</strong> {detail.subclaseProceso}</div>
                     <div><strong>Recurso:</strong> {detail.recurso || 'N/A'}</div>
                     <div><strong>Contenido:</strong> {detail.contenidoRadicacion || 'N/A'}</div>
                  </div>
                </div>
              )}

              {activeTab === 'sujetos' && (
                <div>
                  <h3>Sujetos Procesales</h3>
                  <DataContentTable
                    data={subjects}
                    emptyMsg="No se encontraron sujetos procesales."
                    headers={[
                      { key: 'tipoSujeto', label: 'Rol' },
                      { key: 'nombreRazonSocial', label: 'Nombre / Razón Social' },
                      { key: 'identificacion', label: 'Identificación' }
                    ]}
                  />
                </div>
              )}

              {activeTab === 'documentos' && (
                <div>
                  <h3>Documentos Digitalizados</h3>
                  <DataContentTable
                    data={documents}
                    emptyMsg="No hay documentos disponibles."
                    headers={[
                      { key: 'fecha', label: 'Fecha' },
                      { key: 'nombre', label: 'Nombre Documento' },
                      { key: 'tipo', label: 'Tipo' },
                      { key: 'descripcion', label: 'Descripción' }
                    ]}
                  />
                </div>
              )}

              {activeTab === 'actuaciones' && (
                <div>

                  <div style={{ marginBottom: 40 }}>
                    {actions.length === 0 && <div style={{display:'none'}}>{console.log("Gráfica: 0 actuaciones recibidas")}</div>}
                    
                    <ActivityChart 
                      actuaciones={actions} 
                      onMonthClick={handleChartClick} 
                    />
                    
                    {filtroMes && (
                      <div style={{ marginTop: 16, textAlign: 'center' }}>
                        <div style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: 12,
                          background: '#EFF6FF', color: '#1E40AF',
                          padding: '10px 20px', borderRadius: '99px', fontSize: '0.95rem', border: '1px solid #DBEAFE'
                        }}>
                          <span>Filtrado por: <strong>{filtroMes}</strong> ({actuacionesFiltradas.length} registros)</span>
                          <button 
                            onClick={() => setFiltroMes(null)}
                            title="Ver todas"
                            style={{ border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            <FaTimes /> Quitar filtro
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div id="tabla-actuaciones">
                    <h3 style={{ marginBottom: 16, color: 'var(--brand-primary)' }}>
                        Listado de Actuaciones
                    </h3>
                    <DataContentTable
                      data={actuacionesFiltradas}
                      emptyMsg="No hay actuaciones registradas."
                      headers={[
                        { key: 'fechaMostrable', label: 'Fecha' },
                        { key: 'actuacionMostrable', label: 'Actuación' },
                        { key: 'anotacionMostrable', label: 'Anotación' },
                        { key: 'conDocs', label: 'Docs' }
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProcessDetailPage;
