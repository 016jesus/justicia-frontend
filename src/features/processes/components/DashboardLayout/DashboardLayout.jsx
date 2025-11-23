import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children, activeItem = 'consultar' }) => { 
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false); // Cerrar sidebar por defecto en móvil
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cerrar sidebar al cambiar de página en móvil
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Backdrop para móviles */}
      {isMobile && isSidebarOpen && (
        <div 
          className={styles.backdrop} 
          onClick={closeSidebar}
          aria-label="Cerrar menú"
        />
      )}
      
      <Sidebar isOpen={isSidebarOpen} activeItem={activeItem} />
      <div className={`${styles.mainContent} ${isSidebarOpen ? styles.shifted : ''}`}>
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className={styles.contentArea}>
          <div key={location.pathname} className={styles.pageFade}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;