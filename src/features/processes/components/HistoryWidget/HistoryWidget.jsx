import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cachedGet } from '../../../../services/cachedApi';
import styles from './HistoryWidget.module.css';

const HistoryWidget = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await cachedGet('/api/legal-processes/history', {}, { ttlMs: 60000 });
        const data = res && res.data;
        if (data && Array.isArray(data)) {
          setItems(data.slice().sort((a, b) => new Date(b.date) - new Date(a.date)));
        } else if (Array.isArray(data)) {
          setItems(data.slice());
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
        const extract = (data) => {
          if (!data) return null;
          if (typeof data === 'string') return data;
          if (data.message) return data.message;
          if (data.Message) return data.Message;
          try { const s = JSON.stringify(data); if (s.length < 300) return s; } catch (e) {}
          return null;
        };
        if (err.response && err.response.data) {
          setError(extract(err.response.data) || 'No se pudo cargar el historial.');
        } else if (err.request) {
          setError('No hubo respuesta del servidor. Verifica tu conexión.');
        } else {
          setError('Error: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const latest = items.slice(0, 6);

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h4>Historial de consultas</h4>
        <small className={styles.sub}>Últimas {items.length > 6 ? 6 : items.length}</small>
      </div>

      {loading && (
        <div>
          <div className={styles.skeletonList}>
            <div className={styles.skeletonRow}>
              <div className={styles.skeletonLeft}><div className="skeleton-line" style={{ width: '60%' }} /></div>
              <div className={styles.skeletonRight}><div className="skeleton-line" /></div>
            </div>
            <div className={styles.skeletonRow}>
              <div className={styles.skeletonLeft}><div className="skeleton-line" style={{ width: '55%' }} /></div>
              <div className={styles.skeletonRight}><div className="skeleton-line" /></div>
            </div>
            <div className={styles.skeletonRow}>
              <div className={styles.skeletonLeft}><div className="skeleton-line" style={{ width: '70%' }} /></div>
              <div className={styles.skeletonRight}><div className="skeleton-line" /></div>
            </div>
          </div>
        </div>
      )}
      {error && <div className={styles.error}>{error}</div>}

      {!loading && !error && latest.length === 0 && (
        <div className={styles.empty}>Aún no has realizado consultas.</div>
      )}

      {!loading && !error && latest.length > 0 && (
        <ul className={styles.list}>
          {latest.map((it) => (
            <li key={it.id} className={styles.item} onClick={() => it.legalProcessId && navigate(`/consultas/detalle/${encodeURIComponent(it.legalProcessId)}`)} role="button" tabIndex={0}>
              <div className={styles.itemLeft}>
                <div className={styles.lp}>{it.legalProcessId || it.result || '—'}</div>
              </div>
              <div className={styles.itemRight}>{it.date ? new Date(it.date).toLocaleString() : new Date(it.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && items.length > 6 && (
        <div className={styles.footer}>
          <button className={styles.viewAll} onClick={() => navigate('/consultas/historial')}>Ver historial completo</button>
        </div>
      )}
    </div>
  );
};

export default HistoryWidget;
