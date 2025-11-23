import React, { useMemo, useCallback } from 'react';
import styles from './Sidebar.module.css';
import { FaFolder, FaSearch, FaHistory } from 'react-icons/fa';
import { IoMdAddCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, activeItem }) => {
  const navigate = useNavigate();
  
  const menuItems = useMemo(() => [
    { id: 'mis-procesos', name: 'Mis procesos', icon: <FaFolder />, to: '/mis-procesos' },
    { id: 'consultar', name: 'Consultar', icon: <FaSearch />, to: '/consultas' },
    { id: 'cargar', name: 'Cargar', icon: <IoMdAddCircle />, to: '/cargar' },
    { id: 'historial', name: 'Historial', icon: <FaHistory />, to: '/consultas/historial' },
  ], []);

  const handleNavigate = useCallback((to) => {
    navigate(to);
  }, [navigate]);

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.menuHeader}>
        {isOpen && <h3>Menú</h3>}
      </div>
      <nav className={styles.menu}>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={activeItem === item.id ? styles.active : ''}
            >
              <button className={styles.linkButton} onClick={() => handleNavigate(item.to)}>
                <span className={styles.icon}>{item.icon}</span>
                {isOpen && <span className={styles.text}>{item.name}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default React.memo(Sidebar);