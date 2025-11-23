import React, { useMemo, useState, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import * as XLSX from 'xlsx';
import apiClient from '../../../services/APIClient';
import { invalidateCacheByPrefix } from '../../../services/cachedApi';
import styles from './CargarPage.module.css'; 

import { FaCloudUploadAlt, FaFileExcel, FaFileCsv, FaTimes } from 'react-icons/fa';

const CargarPage = () => {
  const [fileName, setFileName] = useState('');
  const [rawValues, setRawValues] = useState([]);
  const [validItems, setValidItems] = useState([]);
  const [invalidItems, setInvalidItems] = useState([]);
  const [assocStatus, setAssocStatus] = useState({});
  const [parsing, setParsing] = useState(false);
  const [associating, setAssociating] = useState(false);
  const [showAllValid, setShowAllValid] = useState(false);
  
  // Estado para el Drag & Drop visual
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const counts = useMemo(() => ({
    total: rawValues.length,
    valid: validItems.length,
    invalid: invalidItems.length,
    success: Object.values(assocStatus).filter(s => s.status === 'success').length,
    error: Object.values(assocStatus).filter(s => s.status === 'error').length,
  }), [rawValues, validItems, invalidItems, assocStatus]);

  const resetAll = () => {
    setRawValues([]);
    setValidItems([]);
    setInvalidItems([]);
    setAssocStatus({});
    setFileName('');
    setShowAllValid(false);
  };

  // --- LÓGICA DE PARSEO ORIGINAL (INTACTA) ---
  const sanitizeDigits = (v) => (v || '').toString().replace(/\D+/g, '');
  const looksLikeHeader = (v) => {
    if (!v) return false;
    const hasLetters = /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(v);
    const digits = sanitizeDigits(v);
    return hasLetters && digits.length !== 23;
  };

  const parseCsvText = (text) => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    let values = lines.map(line => {
      let first = line.split(/[;,]/)[0] || '';
      if ((first.startsWith('"') && first.endsWith('"')) || (first.startsWith("'") && first.endsWith("'"))) {
        first = first.slice(1, -1);
      }
      return first.trim();
    });
    if (values.length && looksLikeHeader(values[0])) {
      values = values.slice(1);
    }
    return values;
  };

  const parseXlsxFile = async (file) => {
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data, { type: 'array' });
    const sheetName = wb.SheetNames[0];
    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
    let values = rows
      .map(r => (Array.isArray(r) ? (r[0] ?? '') : ''))
      .map(v => (typeof v === 'string' ? v.trim() : String(v)))
      .filter(v => v && v.length > 0);
    if (values.length && looksLikeHeader(values[0])) {
      values = values.slice(1);
    }
    return values;
  };

  const processFile = async (file) => {
    if (!file) return;
    setParsing(true);
    setFileName(file.name);
    setAssocStatus({});
    try {
      let values = [];
      const nameLower = file.name.toLowerCase();
      if (nameLower.endsWith('.xlsx') || nameLower.endsWith('.xls')) {
        values = await parseXlsxFile(file);
      } else {
        const text = await file.text();
        values = parseCsvText(text);
      }

      const seen = new Set();
      const valid = [];
      const invalid = [];
      for (const original of values) {
        const digits = sanitizeDigits(original);
        if (!digits) {
          invalid.push({ original, reason: 'Vacío' });
          continue;
        }
        if (seen.has(digits)) {
          invalid.push({ original, reason: 'Duplicado' });
          continue;
        }
        seen.add(digits);
        if (digits.length !== 23) {
          invalid.push({ original, reason: 'No contiene 23 dígitos' });
          continue;
        }
        valid.push({ digits });
      }

      setRawValues(values);
      setValidItems(valid);
      setInvalidItems(invalid);
    } catch (err) {
      console.error('Error al leer el archivo:', err);
      setInvalidItems([{ original: file.name, reason: 'No se pudo procesar el archivo' }]);
    } finally {
      setParsing(false);
    }
  };

  // --- MANEJADORES DE DRAG & DROP ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  // --- LÓGICA DE ASOCIACIÓN (INTACTA) ---
  const associateAll = async () => {
    setAssociating(true);
    const nextStatus = { ...assocStatus };
    try {
      for (const item of validItems) {
        const key = item.digits;
        if (nextStatus[key]?.status === 'success') continue;
        nextStatus[key] = { status: 'pending' };
        setAssocStatus({ ...nextStatus });
        try {
          const res = await apiClient.post(`/api/legal-processes/${encodeURIComponent(key)}`);
          if (res && (res.status >= 200 && res.status < 300)) {
            nextStatus[key] = { status: 'success' };
          } else {
            nextStatus[key] = { status: 'error', message: 'Fallo' };
          }
        } catch (err) {
          let msg = 'Error';
          if (err.response && err.response.data) {
             msg = err.response.data.message || 'Error';
          }
          nextStatus[key] = { status: 'error', message: msg };
        }
        setAssocStatus({ ...nextStatus });
      }
    } finally {
      setAssociating(false);
      invalidateCacheByPrefix('/api/legal-processes');
    }
  };

  const previewValid = showAllValid ? validItems : validItems.slice(0, 10);

  return (
    <DashboardLayout activeItem="cargar">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Cargar Procesos</h1>
          <p style={{ color: 'var(--color-texto-secundario)' }}>
            Importa radicaciones masivamente usando Excel o CSV.
          </p>
        </div>

        {/* --- ZONA DE ARRASTRAR --- */}
        {!fileName ? (
          <div className={styles.uploadCard}>
            <div 
              className={`${styles.dropzone} ${dragActive ? styles.active : ''}`}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              onClick={onButtonClick}
            >
              <div className={styles.iconLarge}>
                <FaCloudUploadAlt />
              </div>
              <p className={styles.dropTitle}>Arrastra tu archivo aquí</p>
              <p className={styles.dropSubtitle}>o haz clic para explorar tu ordenador</p>
              <input ref={inputRef} type="file" className={styles.hiddenInput} onChange={handleChange} accept=".csv,.xlsx,.xls" />
              <div style={{ marginTop: 16 }}>
                 <span className="btn btn-sm btn-secondary">Soporta .CSV y .XLSX</span>
              </div>
            </div>
          </div>
        ) : (
          // --- VISTA DE ARCHIVO CARGADO ---
          <>
            <div className={styles.filePreview}>
              <div className={styles.fileInfo}>
                {fileName.endsWith('.csv') ? 
                  <FaFileCsv size={32} color="#10B981" /> : 
                  <FaFileExcel size={32} color="#166534" />
                }
                <div>
                  <div className={styles.fileName}>{fileName}</div>
                  <div className={styles.fileMeta}>
                    {parsing ? 'Analizando...' : `${counts.total} registros encontrados`}
                  </div>
                </div>
              </div>
              <button className="btn btn-sm btn-danger-ghost" onClick={resetAll}>
                <FaTimes /> Eliminar
              </button>
            </div>

            {/* ESTADISTICAS */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Válidos</span>
                <span className={styles.statValue} style={{color: 'var(--brand-primary)'}}>{counts.valid}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Inválidos</span>
                <span className={styles.statValue} style={{color: counts.invalid > 0 ? 'var(--color-error)' : 'inherit'}}>{counts.invalid}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Procesados</span>
                <span className={styles.statValue}>{counts.success + counts.error} / {counts.valid}</span>
              </div>
            </div>

            {/* BARRA DE PROGRESO */}
            {associating && (
               <div className={styles.progressContainer}>
                 <div className={styles.progressBar} style={{ width: `${(counts.success + counts.error) / Math.max(validItems.length, 1) * 100}%` }}></div>
               </div>
            )}

            {/* BOTONES DE ACCIÓN */}
            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button 
                className="btn btn-primary" 
                onClick={associateAll} 
                disabled={parsing || associating || validItems.length === 0}
              >
                {associating ? 'Procesando...' : `Iniciar Carga de ${validItems.length} Procesos`}
              </button>
            </div>

            {/* TABLA DE VÁLIDOS */}
            {validItems.length > 0 && (
              <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                  <h3 style={{margin:0, fontSize: '1rem'}}>Previsualización de Válidos</h3>
                  {validItems.length > 10 && (
                    <button className="btn btn-sm btn-ghost" onClick={() => setShowAllValid(!showAllValid)}>
                      {showAllValid ? 'Ver menos' : 'Ver todos'}
                    </button>
                  )}
                </div>
                <div className={styles.scrollArea}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Radicación</th>
                        <th className={styles.th}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewValid.map(v => {
                        const st = assocStatus[v.digits];
                        return (
                          <tr key={v.digits}>
                            <td className={`${styles.td} ${styles.fontMono}`}>{v.digits}</td>
                            <td className={styles.td}>
                              {!st && <span className={styles.badge} style={{background:'#F1F5F9', color:'#64748B'}}>Pendiente</span>}
                              {st?.status === 'pending' && <span className={`${styles.badge} ${styles.badgePending}`}>Enviando...</span>}
                              {st?.status === 'success' && <span className={`${styles.badge} ${styles.badgeSuccess}`}>Asociado</span>}
                              {st?.status === 'error' && <span className={`${styles.badge} ${styles.badgeError}`}>{st.message}</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CargarPage;
