import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaHistory } from 'react-icons/fa'; 
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
      <div style={{ width: '100%' }}> 
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>
            <FaHistory /> Historial de Consultas
          </h1>
          <p className={styles.pageSubtitle}>
            Registro completo de tu actividad reciente en la plataforma
          </p>
        </div>
        
        {/* ✅ Skeleton Loading */}
        {loading && (
          <div className={styles.skeletonContainer}>
            <div className="skeleton-block"></div>
            <div className="skeleton-block"></div>
            <div className="skeleton-block"></div>
          </div>
        )}
        
        {error && <div className="errorBox">{error}</div>}

        {!loading && !error && items.length === 0 && (
           <div className={styles.emptyState}>
             <div className={styles.emptyIcon}>📋</div>
             <p>No se encontraron consultas recientes</p>
             <small>Realiza tu primera búsqueda para ver tu historial aquí</small>
           </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className={styles.historyCard}>
            {/* ✅ Tabla mejorada con CSS Grid */}
            <div className={styles.tableGrid}>
              {/* Header */}
              <div className={styles.tableHeader}>
                <div className={styles.colRadicacion}>Radicación Consultada</div>
                <div className={styles.colFecha}>Fecha y Hora</div>
                <div className={styles.colAcciones}>Acciones</div>
              </div>

              {/* Filas */}
              {items.map((it, index) => {
                const isFound = !!it.legalProcessId;
                
                return (
                  <div key={it.id || index} className={styles.tableRow}>
                    <div className={styles.colRadicacion}>
                      <span className={styles.radicacionText}>
                        {it.radicacion || it.legalProcessId || 'Desconocido'}
                      </span>
                    </div>
                    
                    <div className={styles.colFecha}>
                      <span className={styles.dateText}>
                        {it.date ? new Date(it.date).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'}
                      </span>
                    </div>
                    
                    <div className={styles.colAcciones}>
                      {isFound && (
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => navigate(`/consultas/detalle/${encodeURIComponent(it.legalProcessId)}`)}
                          title="Ver expediente"
                        >
                          <FaSearch style={{marginRight: 6}}/> Ver Detalle
                        </button>
                      )}
                    </div>
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

