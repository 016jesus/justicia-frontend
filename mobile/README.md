# JustiConsulta Mobile App

Esta es la versión móvil de JustiConsulta, construida con React Native y Expo.

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Expo CLI (se instala automáticamente)
- Para iOS: Xcode (solo en Mac)
- Para Android: Android Studio o dispositivo Android

## Instalación

1. Navega a la carpeta mobile:
```bash
cd mobile
```

2. Instala las dependencias:
```bash
npm install
```

## Ejecución de la Aplicación

### Usando Expo Go (Recomendado para desarrollo)

1. Instala Expo Go en tu dispositivo móvil:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
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
