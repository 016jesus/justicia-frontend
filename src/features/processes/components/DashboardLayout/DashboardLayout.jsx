import React, { useState, useEffect } from 'react';
import styles from './DashboardLayout.module.css';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Breadcrumbs from '../../../../components/Breadcrumbs/Breadcrumbs';

const DashboardLayout = ({ children, activeItem }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className={styles.layoutContainer}>
      {/* Backdrop */}
      {isSidebarOpen && window.innerWidth <= 1024 && (
        <div 
          className={styles.backdrop} 
          onClick={toggleSidebar}
          role="presentation"
          aria-hidden="true"
        />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={toggleSidebar} 
        activeItem={activeItem} 
      />

      <main className={`${styles.mainContent} ${isSidebarOpen ? styles.shifted : ''}`}>
        <Header 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen} 
        />

        <div className={`${styles.contentArea} ${styles.pageFade}`}>
          <Breadcrumbs />
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;