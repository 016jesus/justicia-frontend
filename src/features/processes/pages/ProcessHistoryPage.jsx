import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; 
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import { cachedGet } from '../../../services/cachedApi';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import styles from './ProcessHistoryPage.module.css'; 

const ProcessHistoryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await cachedGet('/api/legal-processes/history', {}, { ttlMs: 60000 });
        const data = res && res.data;
        if (data && Array.isArray(data)) {
          setItems(data.slice().sort((a, b) => new Date(b.date) - new Date(a.date)));
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el historial.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <DashboardLayout activeItem="historial">
      {/* Contenedor fluido para aprovechar todo el ancho */}
      <div style={{ width: '100%' }}> 
        <div className={styles.headerSection}>
          <h1>Historial de Consultas</h1>
          <p style={{color: 'var(--color-texto-secundario)', fontSize: '1.05rem'}}>
            Registro completo de tu actividad reciente en la plataforma.
          </p>
        </div>
        
        {loading && <LoadingSpinner text="Cargando historial..." />}
        {error && <div style={{color: 'var(--color-error)'}}>{error}</div>}

        {!loading && !error && items.length === 0 && (
           <div className="card" style={{textAlign: 'center', padding: 60}}>
             <p style={{color: 'var(--color-texto-secundario)', fontSize: '1.1rem'}}>
               No se encontraron consultas recientes.
             </p>
           </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className={styles.historyCard}>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tr}>
                    {/* Anchos sugeridos para distribuir mejor */}
                    <th className={styles.th} style={{width: '31%'}}>Radicación Consultada</th>
                    <th className={styles.th} style={{width: '34%'}}>Fecha y Hora</th>
                    <th className={styles.th} style={{width: '22%', textAlign: 'right'}}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, index) => {
                    // Determinamos si fue encontrada o no (simulado con legalProcessId)
                    const isFound = !!it.legalProcessId;
                    
                    return (
                      <tr key={it.id || index} className={styles.tr}>
                        <td className={styles.td}>
                          <span style={{
                            fontWeight: 600, 
                            color: 'var(--brand-primary)', 
                            fontFamily: 'Inter, monospace',
                            fontSize: '1rem'
                          }}>
                             {it.radicacion || it.legalProcessId || 'Desconocido'}
                          </span>
                        </td>
                        <td className={styles.td}>
                          <span className={styles.dateText}>
                            {it.date ? new Date(it.date).toLocaleString() : '-'}
                          </span>
                        </td>
                        
                        <td className={styles.td} style={{textAlign: 'right'}}>
                           {isFound && (
                             <button 
                               className="btn btn-sm btn-secondary"
                               onClick={() => navigate(`/consultas/detalle/${encodeURIComponent(it.legalProcessId)}`)}
                               title="Ver expediente"
                             >
                               <FaSearch style={{marginRight: 6}}/> Ver
                             </button>
                           )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Vista de cards para móvil */}
            <div className={styles.mobileCards}>
              {items.map((it, index) => {
                const isFound = !!it.legalProcessId;
                return (
                  <div key={it.id || index} className={styles.mobileCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardLabel}>Radicación</span>
                      <span className={styles.cardRadicacion}>
                        {it.radicacion || it.legalProcessId || 'Desconocido'}
                      </span>
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>Fecha y Hora</span>
                        <span className={styles.cardValue}>
                          {it.date ? new Date(it.date).toLocaleString() : '-'}
                        </span>
                      </div>
                    </div>
                    {isFound && (
                      <div className={styles.cardActions}>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => navigate(`/consultas/detalle/${encodeURIComponent(it.legalProcessId)}`)}
                          style={{width: '100%'}}
                        >
                          <FaSearch style={{marginRight: 6}}/> Ver Expediente
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProcessHistoryPage;




