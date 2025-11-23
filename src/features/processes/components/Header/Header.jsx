import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './Header.module.css';
import { FaBars, FaUserCircle, FaChevronDown, FaBell } from 'react-icons/fa';
import { useAuth } from '../../../../context/AuthContext';
import apiClient from '../../../../services/APIClient';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const notifRef = useRef(null);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifsLoading, setNotifsLoading] = useState(false);

  const formatFullName = useCallback((u) => {
    if (!u) return 'Usuario';
    const parts = [u.firstName, u.middleName, u.firstLastName, u.secondLastName];
    return parts.filter(Boolean).join(' ');
  }, []);

  const fetchNotifications = useCallback(async () => {
    setNotifsLoading(true);
    try {
      const res = await apiClient.get('/api/notifications');
      if (res && res.data && Array.isArray(res.data)) setNotifications(res.data);
      else setNotifications([]);
    } catch (e) {
      console.warn('Error fetching notifications', e);
      setNotifications([]);
    } finally {
      setNotifsLoading(false);
    }
  }, []);

  useEffect(() => {
    const onOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onOutsideClick);
    return () => document.removeEventListener('click', onOutsideClick);
  }, []);

  useEffect(() => {
    const onOutsideClickNotif = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifsOpen(false);
      }
    };
    document.addEventListener('click', onOutsideClickNotif);
    return () => document.removeEventListener('click', onOutsideClickNotif);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button onClick={toggleSidebar} className={styles.menuButton} aria-label="Toggle Menu">
          <FaBars />
        </button>
        <h1 className={styles.title}>CONSULTAS DE PROCESOS NACIONAL UNIFICADA</h1>
      </div>

      <div className={styles.userProfile} ref={containerRef}>
        {/* Widget de Notificaciones */}
        <div className={styles.notifContainer} ref={notifRef}>
          <button 
            className={styles.notifButton} 
            onClick={async () => { 
              const next = !notifsOpen; 
              setNotifsOpen(next); 
              if (next) await fetchNotifications(); 
            }} 
            aria-label="Notificaciones"
            aria-expanded={notifsOpen}
          >
            <FaBell />
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
          
          {notifsOpen && (
            <>
              <div className={styles.overlay} onClick={() => setNotifsOpen(false)} />
              <div className={styles.notifDropdown}>
                <div className={styles.notifHeader}>
                  <h3>Notificaciones</h3>
                  {unreadCount > 0 && (
                    <span className={styles.unreadBadge}>{unreadCount} sin leer</span>
                  )}
                </div>
                
                <div className={styles.notifBody}>
                  {notifsLoading && (
                    <div className={styles.notifEmpty}>
                      <div className={styles.spinner}></div>
                      <p>Cargando...</p>
                    </div>
                  )}
                  
                  {!notifsLoading && notifications.length === 0 && (
                    <div className={styles.notifEmpty}>
                      <FaBell className={styles.emptyIcon} />
                      <p>No hay notificaciones</p>
                      <span className={styles.emptySub}>Estás al día</span>
                    </div>
                  )}
                  
                  {!notifsLoading && notifications.length > 0 && (
                    <ul className={styles.notifList}>
                      {notifications.map(n => (
                        <li 
                          key={n.notificationId} 
                          className={`${styles.notifItem} ${!n.isRead ? styles.notifItemUnread : ''}`}
                          onClick={() => {
                            // Marcar como leída y navegar si es necesario
                            console.log('Notification clicked:', n);
                          }}
                        >
                          <div className={styles.notifContent}>
                            <div className={styles.notifText}>
                              {n.message || (n.action && n.action.description) || 'Nueva actividad'}
                            </div>
                            <div className={styles.notifDate}>
                              {n.date ? new Date(n.date).toLocaleString('es-ES', { 
                                day: '2-digit', 
                                month: 'short', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              }) : ''}
                            </div>
                          </div>
                          {!n.isRead && <span className={styles.unreadDot}></span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {!notifsLoading && notifications.length > 0 && (
                  <div className={styles.notifFooter}>
                    <button className={styles.footerButton}>Ver todas</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <button className={styles.userButton} onClick={() => setOpen((s) => !s)}>
          <FaUserCircle className={styles.userIcon} />
          <div className={styles.userInfoInline}>
            <span className={styles.userName}>{formatFullName(user)}</span>
            <FaChevronDown className={styles.chevron} />
          </div>
        </button>

        {open && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownItem}>
              <strong>{formatFullName(user)}</strong>
              <div className={styles.dropdownSub}>{user?.email}</div>
            </div>
            <button className={styles.dropdownItemButton} onClick={() => { setOpen(false); logout(); }}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default React.memo(Header);