import React, { useState, useCallback } from 'react';
import styles from './ConsultationForm.module.css';
import { FaDownload, FaBroom, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { cachedGet } from '../../../../services/cachedApi';

const ConsultationForm = () => {
  const [radicacion, setRadicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  const clear = useCallback(() => {
    setRadicacion('');
    setResults([]);
    setError(null);
  }, []);

  const consultar = useCallback(async () => {
    setError(null);
    setResults([]);
    if (!radicacion) {
      setError('Ingresa el número de radicación');
      return;
    }

    const pagina = Math.floor(Math.random() * 100) + 1;
    const url = `/api/legal-processes/${encodeURIComponent(radicacion)}?SoloActivos=false&pagina=${pagina}`;
    const cacheKey = `/api/legal-processes/${encodeURIComponent(radicacion)}?SoloActivos=false`;

    setLoading(true);
    try {
      const res = await cachedGet(url, {}, { ttlMs: 180000, cacheKey });
      const data = res && res.data;
      if (data && Array.isArray(data.procesos)) {
        setResults(data.procesos);
      } else {
        setError('Respuesta inesperada del servidor al consultar el proceso');
      }
    } catch (err) {
      console.error('Error al consultar proceso:', err);
      
      // TU LÓGICA ORIGINAL DE ERRORES (La mantengo intacta)
      const buildMessage = (data) => {
        if (!data) return null;
        if (typeof data === 'string') return data;
        if (data.message) return data.message;
        if (data.Message) return data.Message;
        if (data.StatusCode && data.Message) return `${data.Message}`;
        if (data.errors && typeof data.errors === 'object') {
          try {
            const parts = Object.values(data.errors).flat().map(v => Array.isArray(v) ? v.join(', ') : String(v));
            return parts.join(' — ');
          } catch (e) {}
        }
        try {
          const s = JSON.stringify(data);
          if (s && s.length < 300) return s;
        } catch (e) {}
        return null;
      };

      if (err.response && err.response.data) {
        const friendly = buildMessage(err.response.data) || 'Error en la consulta: revisa los datos e intenta de nuevo.';
        setError(friendly);
      } else if (err.request) {
        setError('No hubo respuesta del servidor. Verifica tu conexión.');
      } else {
        setError('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [radicacion]);

  const toggleDetails = useCallback(async (idProceso) => {
    setExpanded((prev) => ({ ...prev, [idProceso]: !prev[idProceso] }));
    // TU LÓGICA ORIGINAL DE CARGA DE ACTUACIONES
    if (!expanded[idProceso]) {
      try {
        const res = await cachedGet(`/api/actions/${encodeURIComponent(idProceso)}`, {}, { ttlMs: 60000 });
        const data = res && res.data;
        if (data) {
          const actuaciones = Array.isArray(data.actuaciones) ? data.actuaciones : (Array.isArray(data) ? data : data.actuaciones || data);
          setResults((prev) => prev.map(p => p.idProceso === idProceso ? { ...p, actuaciones } : p));
        }
      } catch (e) {
        console.warn('No se pudieron cargar actuaciones para', idProceso, e);
      }
    }
  }, [expanded]);

  return (
    <> {/* Fragmento para permitir múltiples tarjetas */}
      
      {/* === TARJETA 1: FORMULARIO === */}
      <div className={styles.formCard}>
        <label htmlFor="radicacion" className={styles.label}>
          Número de radicación
        </label>
        <input
          id="radicacion"
          type="text"
          placeholder="Ej. 50001333100120070007600"
          className={styles.input}
          value={radicacion}
          onChange={(e) => setRadicacion(e.target.value)}
        />
        
        <div className={styles.buttonGroup}>
          <button className="btn btn-primary" onClick={consultar} disabled={loading}>
            <FaSearch /> {loading ? 'Consultando...' : 'Consultar'}
          </button>
          
          <button className="btn btn-secondary" onClick={clear}>
            <FaBroom /> Limpiar
          </button>
          
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <FaDownload /> Descargar
          </button>
        </div>
      </div>

      {/* MENSAJES DE ERROR */}
      {error && <div className={styles.errorBox}>{error}</div>}

      {/* === TARJETA 2: RESULTADOS (Separada) === */}
      <div className={styles.results}>
        {results.length === 0 && !loading && !error && (
           <div className={styles.empty}>Sin resultados</div>
        )}

        {results.map((proc) => (
          <div key={proc.idProceso} className={styles.procCard} tabIndex={0}>
            
            {/* Header del Resultado */}
            <div className={styles.procHeader} onClick={() => toggleDetails(proc.idProceso)}>
              <div>
                <div className={styles.procTitle}>{proc.llaveProceso}</div>
                <div className={styles.procMeta}>{proc.despacho} • {proc.departamento}</div>
              </div>
              <button className={styles.detailToggle}>
                {expanded[proc.idProceso] ? <FaChevronUp /> : <FaChevronDown />}
                {expanded[proc.idProceso] ? ' Ocultar' : ' Ver Actuaciones'}
              </button>
            </div>

            {/* Cuerpo Expandible */}
            {expanded[proc.idProceso] && (
              <div className={styles.procBody}>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div><strong>Fecha proceso:</strong> {new Date(proc.fechaProceso).toLocaleDateString()}</div>
                  <div><strong>Última actuación:</strong> {proc.fechaUltimaActuacion ? new Date(proc.fechaUltimaActuacion).toLocaleDateString() : 'N/A'}</div>
                  <div><strong>Sujetos:</strong> {proc.sujetosProcesales}</div>
                  <div><strong>Privado:</strong> {proc.esPrivado ? 'Sí' : 'No'}</div>
                </div>

                {/* Sección de Actuaciones (Lógica original preservada) */}
                <div className={styles.actuacionesSection}>
                   <h4>Actuaciones Recientes</h4>
                   {proc.actuaciones && proc.actuaciones.length > 0 ? (
                      <ul style={{ paddingLeft: 20, fontSize: '0.9rem' }}>
                        {proc.actuaciones.slice(0, 3).map((act, idx) => (
                          <li key={idx} style={{ marginBottom: 6 }}>
                            <strong>{new Date(act.fechaActuacion || act.fechaRegistro).toLocaleDateString()}:</strong> {act.actuacion}
                          </li>
                        ))}
                      </ul>
                   ) : (
                     <div className={styles.muted}>No hay actuaciones visibles o cargando...</div>
                   )}
                </div>

                <div style={{ marginTop: 16, textAlign: 'right' }}>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={(e) => { e.stopPropagation(); navigate(`/consultas/detalle/${proc.idProceso}`); }}
                  >
                    Ver Expediente Completo
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ConsultationForm;