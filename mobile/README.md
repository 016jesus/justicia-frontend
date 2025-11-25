# 📱 JustiConsulta Mobile

Aplicación móvil para consulta de procesos judiciales de Colombia.

## 🚀 Inicio Rápido

### Probar sin compilar APK (Recomendado)

```powershell
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm start

# 3. Escanear QR con Expo Go
#    - Descargar Expo Go desde Play Store o App Store
#    - Escanear el QR que aparece en la terminal
```

📖 **Guía completa**: Ver [MOBILE_TESTING.md](./MOBILE_TESTING.md)

---

## 📋 Requisitos

- Node.js 14+
- Expo Go (app móvil)
- Red WiFi (PC y móvil en la misma red)

---

## 🎯 Funcionalidades

### ✅ Implementado
- Login con validación
- Registro de usuarios
- Navegación entre pantallas
- Gestión de sesión (AsyncStorage)

### 🔄 En Desarrollo  
- Recuperación de contraseña
- Consulta de procesos
- Historial de consultas
- Mis procesos asociados

📖 **Guía de implementación**: Ver [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

---

## 🐛 Solución de Problemas

### Error 403 al hacer login
✅ Ya solucionado. El API_KEY se envía correctamente en todos los requests.

Si persiste:
1. Ver logs en la terminal
2. Verificar conectividad: https://jesucripto.win
3. Limpiar caché: `npx expo start --clear`

📖 **Troubleshooting completo**: Ver [MOBILE_TESTING.md](./MOBILE_TESTING.md)

---

## 🎨 Identidad de Marca

- **Primary**: #0F172A (Navy)
- **Accent**: #D97706 (Gold)  
- **Colores** aplicados en todos los componentes

---

## 📚 Documentación

- [MOBILE_TESTING.md](./MOBILE_TESTING.md) - Guía de pruebas y debugging
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Plantillas para nuevas pantallas
- [../ICONS_GUIDE.md](../ICONS_GUIDE.md) - Generar iconos de la app
- [../MOBILE_SUMMARY.md](../MOBILE_SUMMARY.md) - Resumen completo del proyecto

---

## 🔧 Comandos Útiles

```powershell
npm start              # Iniciar servidor de desarrollo
npm start --clear      # Iniciar limpiando caché
npm start --tunnel     # Usar tunnel (diferentes redes)
npm run android        # Abrir en emulador Android
```

---

## 📱 Estructura del Proyecto

```
mobile/
├── src/
│   ├── features/
│   │   ├── auth/           # Autenticación
│   │   │   ├── screens/    # LoginScreen, RegisterScreen
│   │   │   └── services/   # Validaciones Zod
│   │   └── processes/      # Procesos judiciales
│   │       └── screens/    # Consulta, Detalle, Historial
│   ├── navigation/         # AppNavigator
│   ├── context/            # AuthContext
│   ├── services/           # APIClient
│   └── config/             # constants.js
├── assets/                 # Iconos y splash screen
├── app.json               # Configuración Expo
└── package.json
```

---

## 🌐 API

**Base URL**: `https://jesucripto.win`  
**API Key**: Configurada en `src/config/constants.js`

### Endpoints principales:
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/processes/search` - Buscar proceso
- `GET /api/history` - Historial de consultas

---

## 👥 Contribuir

1. Revisar [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
2. Usar colores de marca (navy/gold)
3. Seguir estructura de componentes existentes
4. Probar con Expo Go antes de commit

---

## 📄 Licencia

Proyecto académico - Universidad de los Llanos

---

**Última actualización**: Noviembre 24, 2025
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Inicia el servidor de desarrollo:
```bash
npm start
```

3. Escanea el código QR con tu dispositivo:
   - iOS: Usa la aplicación de cámara
   - Android: Usa la app Expo Go

### Usando Simuladores/Emuladores

Para iOS (solo Mac):
```bash
npm run ios
```

Para Android:
```bash
npm run android
```

Para Web (preview):
```bash
npm run web
```

## Estructura del Proyecto

```
mobile/
├── App.js                 # Punto de entrada principal
├── app.json              # Configuración de Expo
├── package.json          # Dependencias del proyecto
└── src/
    ├── config/           # Configuración y constantes
    │   └── constants.js
    ├── context/          # Context API (AuthContext)
    │   └── AuthContext.js
    ├── navigation/       # Navegación de la app
    │   └── AppNavigator.js
    ├── services/         # Servicios y API
    │   └── APIClient.js
    ├── features/         # Características de la aplicación
    │   ├── auth/        # Autenticación
    │   │   ├── screens/
    │   │   ├── components/
    │   │   └── services/
    │   └── processes/   # Gestión de procesos
    │       ├── screens/
    │       └── components/
    └── components/       # Componentes compartidos
```

## Tecnologías Utilizadas

- **React Native**: Framework para desarrollo móvil
- **Expo**: Plataforma para desarrollo rápido
- **React Navigation**: Navegación entre pantallas
- **Axios**: Cliente HTTP para llamadas API
- **React Hook Form**: Manejo de formularios
- **Zod**: Validación de esquemas
- **AsyncStorage**: Almacenamiento local

## Características Implementadas

### Autenticación
- ✅ Pantalla de Login
- 🚧 Pantalla de Registro (próximamente)
- 🚧 Recuperación de contraseña (próximamente)

### Gestión de Procesos
- ✅ Navegación básica
- 🚧 Consulta de procesos (próximamente)
- 🚧 Detalle de proceso (próximamente)
- 🚧 Historial de procesos (próximamente)
- 🚧 Mis procesos (próximamente)

## Diferencias con la Versión Web

### Almacenamiento
- **Web**: localStorage
- **Mobile**: AsyncStorage

### Navegación
- **Web**: React Router DOM
- **Mobile**: React Navigation

### Estilos
- **Web**: CSS / Bootstrap
- **Mobile**: StyleSheet API / React Native Components

### Componentes UI
- **Web**: HTML + Bootstrap
- **Mobile**: Componentes nativos de React Native

## Configuración del API

La aplicación móvil se conecta al mismo backend que la versión web. La URL del API se configura en `src/config/constants.js`:

```javascript
export const API_BASE_URL = 'https://proyecto-justiconsulta.onrender.com';
```

## Próximos Pasos

1. Implementar las pantallas de registro y recuperación de contraseña
2. Migrar la funcionalidad completa de consulta de procesos
3. Implementar el detalle de procesos con toda su funcionalidad
4. Agregar funcionalidades de historial y mis procesos
5. Implementar componentes compartidos (gráficos, tablas, etc.)
6. Agregar pruebas unitarias e integración
7. Optimizar el rendimiento
8. Preparar para publicación en App Store y Google Play

## Troubleshooting

### Error al iniciar la aplicación
```bash
# Limpia la caché de Expo
expo start -c
```

### Problemas con dependencias
```bash
# Elimina node_modules y reinstala
rm -rf node_modules
npm install
```

### Problemas con AsyncStorage
```bash
# Reinstala AsyncStorage
npm install @react-native-async-storage/async-storage
```

## Soporte

Para reportar problemas o solicitar nuevas características, por favor crea un issue en el repositorio del proyecto.

## Licencia

Este proyecto es privado y confidencial.
