import React from 'react';
import styles from './InvalidProcessesModal.module.css';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const InvalidProcessesModal = ({ isOpen, onClose, invalidItems }) => {
  if (!isOpen) return null;

  const groupedByReason = invalidItems.reduce((acc, item) => {
    const reason = item.reason || 'Desconocido';
    if (!acc[reason]) {
      acc[reason] = [];
    }
    acc[reason].push(item);
    return acc;
  }, {});

  const reasonIcons = {
    'Vacío': '📄',
    'Duplicado': '📑',
    'No contiene 23 dígitos': '🔢',
    'No se pudo procesar el archivo': '⚠️'
  };

  const reasonDescriptions = {
    'Vacío': 'Estos registros no contienen ningún valor',
    'Duplicado': 'Estos números de radicación aparecen más de una vez en el archivo',
    'No contiene 23 dígitos': 'El número de radicación debe tener exactamente 23 dígitos numéricos',
    'No se pudo procesar el archivo': 'Error al leer o procesar el contenido del archivo'
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <FaExclamationTriangle className={styles.headerIcon} />
            <div>
              <h2 className={styles.title}>Procesos Inválidos</h2>
              <span className={styles.subtitle}>
                {invalidItems.length} {invalidItems.length === 1 ? 'registro rechazado' : 'registros rechazados'}
              </span>
            </div>
          </div>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <FaTimes />
          </button>
        </div>

        <div className={styles.content}>
          {Object.entries(groupedByReason).map(([reason, items]) => (
            <div key={reason} className={styles.reasonSection}>
              <div className={styles.reasonHeader}>
                <span className={styles.reasonIcon}>{reasonIcons[reason] || '❌'}</span>
                <div className={styles.reasonInfo}>
                  <h3 className={styles.reasonTitle}>{reason}</h3>
                  <p className={styles.reasonDescription}>
                    {reasonDescriptions[reason] || 'Estos registros no cumplen con los requisitos necesarios'}
                  </p>
                  <span className={styles.reasonCount}>
                    {items.length} {items.length === 1 ? 'registro' : 'registros'}
                  </span>
                </div>
              </div>

              <div className={styles.itemsList}>
                {items.map((item, index) => (
                  <div key={index} className={styles.invalidItem}>
                    <span className={styles.itemBullet}>•</span>
                    <span className={styles.itemValue}>
                      {item.original || 'Sin valor'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.helpText}>
            <strong>💡 Sugerencias:</strong>
            <ul>
              <li>Verifica que los números de radicación tengan exactamente 23 dígitos</li>
              <li>Elimina registros duplicados del archivo</li>
              <li>Asegúrate de que no haya filas vacías</li>
              <li>El archivo debe ser .xlsx, .xls o .csv</li>
            </ul>
          </div>
          <button className={styles.closeFooterButton} onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvalidProcessesModal;
