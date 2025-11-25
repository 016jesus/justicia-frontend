# 📱 Implementaciones Móviles Pendientes

## 🎯 Estado Actual

### ✅ Completado
- **LoginScreen**: Funcional con validación Zod
- **RegisterScreen**: Implementado con todos los campos y validación
- **APIClient**: Mejorado con debugging y normalización de URL
- **AuthContext**: Funcional con AsyncStorage

### 🔄 Archivos con Estructura Básica (Necesitan Implementación Completa)
1. **RecoveryPasswordScreen.js**
2. **ProcessConsultationScreen.js**
3. **ProcessDetailScreen.js**  
4. **ProcessHistoryScreen.js**
5. **MyProcessesScreen.js**

---

## 📋 Implementaciones Requeridas

### 1. RecoveryPasswordScreen.js
**Funcionalidad:**
- Input de email con validación
- Llamada a `/api/auth/recovery-password`
- Mostrar mensaje de éxito/error
- Navegación de regreso a Login

**Endpoint:** `POST /api/auth/recovery-password`
```json
{ "email": "usuario@ejemplo.com" }
```

---

### 2. ProcessConsultationScreen.js
**Funcionalidad:**
- Input para número de radicación (23 dígitos)
- Botón de búsqueda
- Mostrar resultados en card
- Botón para ver detalles (navegar a ProcessDetailScreen)
- Loading state
- Error handling

**Endpoint:** `GET /api/processes/search?numeroRadicacion=XXXXX`

**UI Recomendada:**
```
┌────────────────────────────┐
│  Consultar Proceso         │
│                            │
│  [Input: 23 dígitos]       │
│  [Botón: Buscar]           │
│                            │
│  ┌────────────────────┐   │
│  │ Proceso Encontrado │   │
│  │ Radicación: XXX    │   │
│  │ Demandante: XXX    │   │
│  │ [Ver Detalles]     │   │
│  └────────────────────┘   │
└────────────────────────────┘
```

---

### 3. ProcessDetailScreen.js
**Funcionalidad:**
- Recibir `numeroRadicacion` como parámetro
- Cargar detalles del proceso
- Mostrar toda la información (demandante, demandado, juzgado, etc.)
- Botón para asociar proceso (si está autenticado)
- ScrollView para todo el contenido

**Endpoint:** `GET /api/processes/:numeroRadicacion`

**Datos a Mostrar:**
- Número de Radicación
- Demandante
- Demandado
- Tipo de Proceso
- Fecha
- Juzgado
- Ubicación
- Última Actuación
- Botón "Asociar a Mi Cuenta"

---

### 4. ProcessHistoryScreen.js
**Funcionalidad:**
- Mostrar historial de consultas del usuario
- Lista de procesos consultados recientemente
- Fecha y hora de cada consulta
- Click para ver detalles
- Pull to refresh
- Empty state si no hay historial

**Endpoint:** `GET /api/history`

**UI Recomendada:**
```
┌────────────────────────────┐
│  Historial de Consultas    │
│                            │
│  ┌────────────────────┐   │
│  │ 📄 Radicación XXX  │   │
│  │ Consultado: hace 2h│   │
│  └────────────────────┘   │
│                            │
│  ┌────────────────────┐   │
│  │ 📄 Radicación YYY  │   │
│  │ Consultado: ayer   │   │
│  └────────────────────┘   │
└────────────────────────────┘
```

---

### 5. MyProcessesScreen.js
**Funcionalidad:**
- Mostrar procesos asociados al usuario
- Lista de procesos con resumen
- Click para ver detalles
- Botón para agregar nuevo proceso
- Pull to refresh
- Empty state si no hay procesos

**Endpoint:** `GET /api/user-processes`

**UI Recomendada:**
```
┌────────────────────────────┐
│  Mis Procesos              │
│  [+ Agregar Proceso]       │
│                            │
│  ┌────────────────────┐   │
│  │ 📌 Radicación XXX  │   │
│  │ Demandante: AAA    │   │
│  │ Estado: Activo     │   │
│  └────────────────────┘   │
└────────────────────────────┘
```

---

## 🎨 Guía de Estilos (Identidad de Marca)

### Colores
```javascript
const COLORS = {
  primary: '#0F172A',      // Navy (botones principales, títulos)
  accent: '#D97706',       // Gold (botones de acción, highlights)
  background: '#F5F5F5',   // Gris claro (fondo)
  cardBg: '#FFFFFF',       // Blanco (cards)
  text: '#0F172A',         // Navy oscuro (texto principal)
  textSecondary: '#64748B',// Gris (texto secundario)
  border: '#E2E8F0',       // Gris claro (bordes)
  error: '#DC2626',        // Rojo (errores)
  success: '#10B981',      // Verde (éxito)
};
```

### Componentes Reutilizables Recomendados

**Card Component:**
```javascript
<View style={styles.card}>
  <Text style={styles.cardTitle}>Título</Text>
  <Text style={styles.cardText}>Contenido</Text>
</View>
```

**Button Component:**
```javascript
<TouchableOpacity style={styles.primaryButton}>
  <Text style={styles.buttonText}>Acción</Text>
</TouchableOpacity>
```

---

## 🔧 Utilidades Necesarias

### 1. Formateo de Fecha
```javascript
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
```

### 2. Validación de Radicación
```javascript
const validateRadicacion = (value) => {
  const cleaned = value.replace(/\s/g, '');
  return /^\d{23}$/.test(cleaned);
};
```

### 3. Formato de Radicación
```javascript
const formatRadicacion = (value) => {
  const cleaned = value.replace(/\s/g, '');
  return cleaned.replace(/(\d{5})(\d{4})(\d{2})(\d{5})(\d{2})(\d{5})/, 
    '$1 $2 $3 $4 $5 $6');
};
```

---

## 🚀 Prioridades de Implementación

1. **Alta Prioridad:**
   - RecoveryPasswordScreen (complementa la autenticación)
   - ProcessConsultationScreen (funcionalidad principal)
   - ProcessDetailScreen (necesario para consultas)

2. **Media Prioridad:**
   - ProcessHistoryScreen
   - MyProcessesScreen

3. **Baja Prioridad:**
   - Notificaciones push
   - Modo offline
   - Biometría

---

## 📝 Template Base para Pantallas

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import apiClient from '../../../services/APIClient';

const ScreenName = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/endpoint');
      setData(response.data);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#D97706" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Content here */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#D97706',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScreenName;
```

---

## 🔗 Endpoints de la API

| Endpoint | Método | Descripción | Auth |
|----------|--------|-------------|------|
| `/api/auth/login` | POST | Iniciar sesión | No |
| `/api/auth/register` | POST | Registrar usuario | No |
| `/api/auth/recovery-password` | POST | Recuperar contraseña | No |
| `/api/processes/search` | GET | Buscar proceso | No |
| `/api/processes/:numeroRadicacion` | GET | Detalle de proceso | No |
| `/api/history` | GET | Historial consultas | Sí |
| `/api/user-processes` | GET | Procesos del usuario | Sí |
| `/api/user-processes` | POST | Asociar proceso | Sí |
| `/api/user-processes/:id` | DELETE | Desasociar proceso | Sí |

---

## ✅ Checklist de Implementación

Por cada pantalla:
- [ ] Crear estructura básica del componente
- [ ] Agregar estados (loading, data, error)
- [ ] Implementar llamada a la API
- [ ] Agregar manejo de errores
- [ ] Crear UI con cards/inputs según corresponda
- [ ] Aplicar estilos con colores de marca (navy/gold)
- [ ] Agregar loading indicators
- [ ] Implementar navegación
- [ ] Agregar refresh control (si aplica)
- [ ] Probar con datos reales

---

**Última actualización:** Noviembre 24, 2025
**Prioridad siguiente:** RecoveryPasswordScreen → ProcessConsultationScreen → ProcessDetailScreen
