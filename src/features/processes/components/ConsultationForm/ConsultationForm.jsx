import React, { useState, useCallback } from 'react';
import styles from './ConsultationForm.module.css';
import { FaDownload, FaBroom, FaSearch, FaChevronDown, FaChevronUp, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { cachedGet } from '../../../../services/cachedApi';
import toast from 'react-hot-toast';

const ConsultationForm = () => {
  const [radicacion, setRadicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [isValid, setIsValid] = useState(false); 
  const navigate = useNavigate();


  const handleRadicacionChange = (e) => {
    const val = e.target.value;
    
    if (/^\d*$/.test(val)) {
      setRadicacion(val);
      setError(null);
      
      setIsValid(val.length >= 10);
    } else {
      toast.error('Solo se permiten números', {
        duration: 2000,
        icon: '⚠️'
      });
    }
  };

  const clear = useCallback(() => {
    setRadicacion('');
    setResults([]);
    setError(null);
    setIsValid(false);
    toast.success('Formulario limpiado', { icon: '🧹' });
  }, []);

  const consultar = useCallback(async () => {
    setError(null);
    setResults([]);
    
    if (!radicacion) {
      toast.error('Por favor ingresa el número de radicación');
      return;
    }

    if (radicacion.length < 10) {
      toast.error('La radicación debe tener al menos 10 dígitos');
      return;
    }

    const pagina = Math.floor(Math.random() * 100) + 1;
    const url = `/api/legal-processes/${encodeURIComponent(radicacion)}?SoloActivos=false&pagina=${pagina}`;
    const cacheKey = `/api/legal-processes/${encodeURIComponent(radicacion)}?SoloActivos=false`;

    setLoading(true);
    
    const toastId = toast.loading('Consultando proceso...', { icon: '🔍' });
    
    try {
      const res = await cachedGet(url, {}, { ttlMs: 180000, cacheKey });
      const data = res && res.data;
      
      if (data && Array.isArray(data.procesos)) {
        setResults(data.procesos);
        toast.dismiss(toastId);
        
        if (data.procesos.length === 0) {
          toast('No se encontraron procesos con ese número. ¿Verificaste los dígitos?', {
            icon: '🤔',
            duration: 5000
          });
        } else {
          toast.success(`¡Encontrado! ${data.procesos.length} proceso(s)`, {
            icon: '✅'
          });
        }
      } else {
        toast.dismiss(toastId);
        setError('Respuesta inesperada del servidor');
        toast.error('Error en la respuesta del servidor');
      }
    } catch (err) {
      toast.dismiss(toastId);
      console.error('Error al consultar proceso:', err);
      
      const buildMessage = (data) => {
        if (!data) return null;
        if (typeof data === 'string') return data;
        if (data.message) return data.message;
        if (data.Message) return data.Message;
        return null;
      };

      let errorMsg = 'Error al consultar. Intenta nuevamente.';
      
      if (err.response && err.response.data) {
        errorMsg = buildMessage(err.response.data) || errorMsg;
      } else if (err.request) {
        errorMsg = 'Sin respuesta del servidor. Verifica tu conexión.';
      } else {
        errorMsg = err.message;
      }

      toast.error(errorMsg, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  }, [radicacion]);

  const toggleDetails = useCallback(async (idProceso) => {
    setExpanded((prev) => ({ ...prev, [idProceso]: !prev[idProceso] }));
    
    if (!expanded[idProceso]) {
      try {
        const res = await cachedGet(`/api/actions/${encodeURIComponent(idProceso)}`, {}, { ttlMs: 60000 });
        const data = res && res.data;
        if (data) {
          const actuaciones = Array.isArray(data.actuaciones) ? data.actuaciones : (Array.isArray(data) ? data : data.actuaciones || data);
          setResults((prev) => prev.map(p => p.idProceso === idProceso ? { ...p, actuaciones } : p));
        }
      } catch (e) {
        console.warn('No se pudieron cargar actuaciones', e);
        toast.warning('No se pudieron cargar las actuaciones');
      }
    }
  }, [expanded]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && isValid) {
      consultar();
    }
  };

  return (
    <>
      <div className={styles.formCard}>
        <label htmlFor="radicacion" className={styles.label}>
          Número de radicación
        </label>
        
        {/* ✅ INPUT CON VALIDACIÓN VISUAL */}
        <div className={styles.inputWrapper}>
          <input
            id="radicacion"
            type="text"
            placeholder="Ej. 50001333100120070007600"
            className={`${styles.input} ${isValid ? styles.inputValid : ''}`}
            value={radicacion}
            onChange={handleRadicacionChange}
            onKeyPress={handleKeyPress}
            maxLength={23}
            aria-label="Número de radicación del proceso judicial"
            aria-describedby="radicacion-help"
            aria-invalid={radicacion.length > 0 && !isValid}
          />
          {isValid && (
            <FaCheckCircle className={styles.inputIcon} aria-hidden="true" />
          )}
        </div>
        
        <small id="radicacion-help" className={styles.helpText}>
          Solo números • Mínimo 10 dígitos {isValid && '• ✓ Formato correcto'}
        </small>
        
        <div className={styles.buttonGroup}>
          <button 
            className="btn btn-primary" 
            onClick={consultar} 
            disabled={loading || !isValid}
            aria-label="Consultar proceso judicial"
          >
            <FaSearch aria-hidden="true" /> 
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={clear} 
            disabled={loading}
            aria-label="Limpiar formulario"
          >
            <FaBroom aria-hidden="true" /> Limpiar
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => window.print()}
            aria-label="Descargar resultados en PDF"
          >
            <FaDownload aria-hidden="true" /> Descargar
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorBox} role="alert">
          {error}
        </div>
      )}

      <div className={styles.results}>
        {loading && (
          <div className={styles.skeletonContainer} aria-live="polite" aria-busy="true">
            <div className="skeleton-block"></div>
            <div className="skeleton-block"></div>
          </div>
        )}

        {results.length === 0 && !loading && !error && (
           <div className={styles.empty} role="status">
             <div className={styles.emptyIcon} aria-hidden="true">🔍</div>
             <p><strong>Sin resultados</strong></p>
             <small>Ingresa un número de radicación para comenzar tu búsqueda</small>
           </div>
        )}

        {!loading && results.map((proc) => (
          <div key={proc.idProceso} className={styles.procCard} tabIndex={0}>
            <div 
              className={styles.procHeader} 
              onClick={() => toggleDetails(proc.idProceso)}
              role="button"
              aria-expanded={expanded[proc.idProceso]}
              tabIndex={0}
            >
              <div>
                <div className={styles.procTitle}>{proc.llaveProceso}</div>
                <div className={styles.procMeta}>{proc.despacho} • {proc.departamento}</div>
              </div>
              <button 
                className={styles.detailToggle}
                aria-label={expanded[proc.idProceso] ? 'Ocultar actuaciones' : 'Ver actuaciones'}
              >
                {expanded[proc.idProceso] ? <FaChevronUp aria-hidden="true" /> : <FaChevronDown aria-hidden="true" />}
                {expanded[proc.idProceso] ? ' Ocultar' : ' Ver Actuaciones'}
              </button>
            </div>

            {expanded[proc.idProceso] && (
              <div className={styles.procBody}>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div><strong>Fecha proceso:</strong> {new Date(proc.fechaProceso).toLocaleDateString()}</div>
                  <div><strong>Última actuación:</strong> {proc.fechaUltimaActuacion ? new Date(proc.fechaUltimaActuacion).toLocaleDateString() : 'N/A'}</div>
                  <div><strong>Sujetos:</strong> {proc.sujetosProcesales}</div>
                  <div><strong>Privado:</strong> {proc.esPrivado ? 'Sí' : 'No'}</div>
                </div>

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
                     <div className={styles.muted}>No hay actuaciones visibles</div>
                   )}
                </div>

                <div style={{ marginTop: 16, textAlign: 'right' }}>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      navigate(`/consultas/detalle/${proc.idProceso}`); 
                    }}
                    aria-label="Ver expediente completo del proceso"
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