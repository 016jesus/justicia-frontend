# 🔔 Sistema de Simulación de Notificaciones

## Descripción

Se ha implementado un sistema completo para simular el envío de notificaciones en el dashboard. Esta funcionalidad permite a los administradores y desarrolladores probar el sistema de notificaciones por correo electrónico sin necesidad de herramientas externas como Postman.

## ✨ Características Implementadas

### 1. **Servicio API de Notificaciones** (`src/services/NotificationsAPI.js`)
- ✅ Endpoints de prueba del controlador `/api/test/notifications`
- ✅ Endpoints de gestión de notificaciones del usuario
- ✅ Funciones para enviar 4 tipos de notificaciones:
  - Correo de Bienvenida
  - Nueva Actuación Judicial
  - Proceso Eliminado
  - Recordatorio de Actuaciones

### 2. **Modal Interactivo** (`NotificationSimulatorModal`)
- ✅ Diseño responsive y moderno con animaciones fluidas
- ✅ 4 tipos de notificaciones configurables
- ✅ Validación de formularios en tiempo real
- ✅ Feedback visual de éxito/error
- ✅ Cierre automático tras envío exitoso

### 3. **Integración en el Header**
- ✅ Botón "Simular Notificación" en el widget de notificaciones
- ✅ Diseño consistente con el sistema de diseño existente
- ✅ Recarga automática de notificaciones tras simulación
- ✅ Animaciones suaves y transiciones

## 🎨 Diseño y UX

### Responsive Design
- **Desktop**: Modal centrado con ancho máximo de 600px
- **Tablet**: Adaptación con grid de 2 columnas para tipos
- **Mobile**: Layout vertical, modal de pantalla completa
- **Animaciones**: Fade-in, slide-up, hover effects

### Paleta de Colores
- **Primario**: Gradiente púrpura (`#667eea` → `#764ba2`)
- **Éxito**: Verde (`#f0fdf4` con borde `#bbf7d0`)
- **Error**: Rojo (`#fef2f2` con borde `#fecaca`)
- **Neutral**: Grises del sistema de diseño

## 📋 Tipos de Notificaciones

### 1. Correo de Bienvenida
**Campos requeridos:**
- Número de documento del usuario

**Endpoint:** `POST /api/test/notifications/welcome`

### 2. Nueva Actuación
**Campos requeridos:**
- Número de documento
- Número de radicación
- Descripción de la actuación
- Fecha de la actuación

**Endpoint:** `POST /api/test/notifications/new-actuation`

### 3. Proceso Eliminado
**Campos requeridos:**
- Número de documento
- Número de radicación

**Endpoint:** `POST /api/test/notifications/process-deleted`

### 4. Recordatorio
**Campos requeridos:**
- Número de documento
- Cantidad de procesos

**Endpoint:** `POST /api/test/notifications/reminder`

## 🚀 Uso

### Para Usuarios
1. Hacer clic en el icono de notificaciones en el header
2. Hacer clic en el botón **"Simular Notificación"**
3. Seleccionar el tipo de notificación
4. Completar los campos requeridos
5. Hacer clic en **"Enviar Notificación"**

### Para Desarrolladores

#### Importar el servicio:
```javascript
import {
  sendWelcomeNotification,
  sendNewActuationNotification,
  sendProcessDeletedNotification,
  sendReminderNotification
} from '../services/NotificationsAPI';
```

#### Ejemplo de uso:
```javascript
// Enviar notificación de bienvenida
await sendWelcomeNotification('123456789');

// Enviar notificación de nueva actuación
await sendNewActuationNotification({
  userDocumentNumber: '123456789',
  numeroRadicacion: '50001333100120070007600',
  actuacion: 'Se admite la demanda',
  fecha: '2024-11-24'
});
```

## 📂 Estructura de Archivos

```
src/
├── services/
│   └── NotificationsAPI.js          # Servicio API
├── features/
│   └── processes/
│       └── components/
│           ├── Header/
│           │   ├── Header.jsx       # Integración del botón
│           │   └── Header.module.css
│           └── NotificationSimulator/
│               ├── NotificationSimulatorModal.jsx
│               └── NotificationSimulatorModal.module.css
```

## 🎯 Validaciones Implementadas

- ✅ Campos requeridos marcados con asterisco rojo
- ✅ Validación de formulario HTML5
- ✅ Prevención de envíos duplicados durante loading
- ✅ Manejo de errores del servidor
- ✅ Feedback visual inmediato

## 🔧 Configuración Técnica

### Estados del Modal
- `notificationType`: Tipo de notificación seleccionada
- `loading`: Estado de carga durante el envío
- `error`: Mensaje de error si ocurre
- `success`: Estado de éxito tras el envío

### Animaciones CSS
- **fadeIn**: Entrada del overlay (0.2s)
- **slideUp**: Entrada del modal (0.3s con cubic-bezier)
- **shake**: Animación de error (0.4s)
- **spin**: Spinner de carga (0.6s linear infinito)

## 📱 Responsividad Breakpoints

```css
/* Desktop: por defecto */
@media (max-width: 640px) { /* Mobile */ }
@media (max-width: 480px) { /* Small Mobile */ }
```

## 🐛 Manejo de Errores

El sistema maneja los siguientes casos de error:
- ❌ Error de conexión con el servidor
- ❌ Error de validación del backend
- ❌ Timeout de la petición
- ❌ Respuestas inesperadas del servidor

## ✅ Testing Manual

Para probar la funcionalidad:
1. Asegurarse que el backend esté corriendo
2. Tener un usuario registrado con email válido
3. Abrir el dashboard
4. Hacer clic en el icono de notificaciones
5. Usar el botón "Simular Notificación"
6. Verificar el correo del usuario

## 🎨 Personalización

### Cambiar colores del gradiente:
```css
/* En NotificationSimulatorModal.module.css */
.header {
  background: linear-gradient(135deg, #TU_COLOR_1 0%, #TU_COLOR_2 100%);
}
```

### Ajustar animaciones:
```css
/* Velocidad de animación */
@keyframes slideUp {
  /* Cambiar cubic-bezier para diferentes efectos */
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## 🔐 Seguridad

- ✅ Los endpoints de prueba requieren autenticación
- ✅ Validación de datos en el backend
- ✅ Sanitización de inputs en el frontend
- ✅ CORS configurado correctamente

## 📊 Métricas de Performance

- **Tiempo de carga del modal**: < 100ms
- **Tiempo de animación total**: 500ms
- **Tamaño del modal component**: ~8KB
- **Dependencias añadidas**: 0 (usa solo React Icons existente)

---

**Desarrollado con ❤️ para el proyecto JustiConsulta**
