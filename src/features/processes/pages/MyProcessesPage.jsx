import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaTrash } from 'react-icons/fa';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import { cachedGet, invalidateCacheByPrefix } from '../../../services/cachedApi';
import apiClient from '../../../services/APIClient';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import styles from './MyProcessesPage.module.css';

const MyProcessesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState({}); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await cachedGet('/api/legal-processes', {}, { ttlMs: 60000 });
        const data = res && res.data;
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los procesos.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (it) => {
    const id = it?.legalProcessId;
    if (!id || !window.confirm(`¿Eliminar proceso ${id}?`)) return;
    
    setDeleting(p => ({ ...p, [id]: true }));
    try {
      await apiClient.delete(`/api/legal-processes/${encodeURIComponent(id)}`);
      setItems(p => p.filter(x => x.legalProcessId !== id));
      invalidateCacheByPrefix('/api/legal-processes');
    } catch (err) {
      alert('Error al eliminar');
    } finally {
      setDeleting(p => ({ ...p, [id]: false }));
    }
  };

  return (
      <DashboardLayout activeItem="mis-procesos">
        <div className={styles.pageWrapper}>
          
          <div className={styles.header}>
            <h1>Mis procesos</h1>
            <p className={styles.subtitle}>
              Monitorea tus expedientes judiciales guardados.
            </p>
          </div>

          {loading && <LoadingSpinner text="Cargando tus procesos..." />}
          {error && <div className={styles.errorMessage}>{error}</div>}

          {!loading && !error && items.length > 0 && (
            <div className={styles.tableCard}>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr>
                      <th>Radicación</th>
                      <th>Última Actuación</th>
                      <th>Fecha Asociación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {items.map((it) => (
                      <tr key={it.legalProcessId}>
                        <td className={styles.cellRadicacion}>
                          {it.legalProcessId}
                        </td>
                        <td className={styles.cellDate} data-label="Última Actuación: ">
                          {it.lastActionDate ? new Date(it.lastActionDate).toLocaleDateString() : '—'}
                        </td>
                        <td className={styles.cellDate} data-label="Fecha Asociación: ">
                          {it.createdAt ? new Date(it.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className={styles.cellActions}>
                          <div className={styles.actionButtons}>
                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => navigate(`/consultas/detalle/${encodeURIComponent(it.legalProcessId)}`)}
                            >
                              <FaEye style={{ marginRight: 4 }}/> Ver
                            </button>
                            <button 
                              className="btn btn-sm btn-danger-ghost"
                              onClick={() => handleDelete(it)}
                              disabled={deleting[it.legalProcessId]}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  };

export default MyProcessesPage;
