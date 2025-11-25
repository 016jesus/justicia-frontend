import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import styles from './Breadcrumbs.module.css';

const breadcrumbMap = {
  '/consultas': 'Consultas',
  '/consultas/historial': 'Historial',
  '/mis-procesos': 'Mis Procesos',
  '/cargar': 'Cargar Proceso',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // No mostrar en la raíz
  if (pathnames.length === 0) return null;

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        {/* Enlace a Inicio siempre visible */}
        <li className={styles.breadcrumbItem}>
          <Link to="/consultas" className={styles.breadcrumbLink}>
            <FaHome /> Inicio
          </Link>
        </li>

        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          // Detectar si es un ID de proceso (número largo)
          const isProcessId = /^\d{20,}$/.test(name);
          const label = isProcessId 
            ? `Detalle: ${name.slice(0, 10)}...` 
            : breadcrumbMap[routeTo] || name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <React.Fragment key={routeTo}>
              <li className={styles.separator}>
                <FaChevronRight />
              </li>
              <li className={styles.breadcrumbItem}>
                {isLast ? (
                  <span className={styles.breadcrumbCurrent} aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link to={routeTo} className={styles.breadcrumbLink}>
                    {label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;