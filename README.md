# JustiConsulta

Sistema de consulta de procesos judiciales disponible en versiones Web y Mobile.

## 📱 Aplicaciones Disponibles

Este proyecto contiene dos aplicaciones:

1. **Aplicación Web** (React) - En el directorio raíz
2. **Aplicación Móvil** (React Native + Expo) - En el directorio `mobile/`

## 🚀 Inicio Rápido

### Aplicación Web

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Compilar para producción
npm run build
```

La aplicación web se abrirá en [http://localhost:3000](http://localhost:3000)

### Aplicación Móvil

```bash
# Navegar al directorio mobile
cd mobile

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
```

Escanea el código QR con Expo Go (iOS/Android) o ejecuta en simulador.

Ver [mobile/README.md](mobile/README.md) para instrucciones detalladas.

## 📖 Documentación

- **[MIGRATION.md](MIGRATION.md)** - Guía completa de migración y arquitectura
- **[mobile/README.md](mobile/README.md)** - Documentación específica de la app móvil

## 🏗️ Estructura del Proyecto

```
justicia-frontend/
├── src/                    # Código fuente Web
├── public/                 # Recursos públicos Web
├── mobile/                 # Aplicación Móvil
│   ├── src/               # Código fuente Mobile
│   ├── App.js             # Punto de entrada Mobile
│   └── README.md          # Documentación Mobile
├── package.json           # Dependencias Web
├── MIGRATION.md           # Guía de migración
└── README.md              # Este archivo
```

## 🛠️ Tecnologías

### Web
- React 19.2.0
- React Router DOM
- Bootstrap
- Axios
- React Hook Form + Zod

### Mobile
- React Native 0.81.5
- Expo SDK 54
- React Navigation
- AsyncStorage
- Axios
- React Hook Form + Zod

## 📝 Scripts Disponibles (Web)

### `npm start`

Ejecuta la aplicación web en modo desarrollo.\
Abre [http://localhost:3000](http://localhost:3000) para verla en el navegador.

La página se recargará cuando hagas cambios.\
También podrás ver errores de lint en la consola.

### `npm test`

Lanza el test runner en modo interactivo.\
Ver [running tests](https://facebook.github.io/create-react-app/docs/running-tests) para más información.

### `npm run build`

Compila la aplicación para producción en la carpeta `build`.\
Empaqueta React en modo producción y optimiza para mejor rendimiento.

El build está minificado y los nombres de archivos incluyen hashes.\
¡Tu aplicación está lista para ser desplegada!

Ver [deployment](https://facebook.github.io/create-react-app/docs/deployment) para más información.

## 🔗 Recursos Adicionales

### Web
- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)

### Mobile
- [React Native documentation](https://reactnative.dev/)
- [Expo documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)

## 📱 Desarrollo en Paralelo

Puedes ejecutar ambas aplicaciones simultáneamente:

**Terminal 1 (Web):**
```bash
npm start
```

**Terminal 2 (Mobile):**
```bash
cd mobile
npm start
```

## 🤝 Contribución

Por favor consulta [MIGRATION.md](MIGRATION.md) para entender la arquitectura antes de contribuir.

## 📄 Licencia

Este proyecto es privado y confidencial.

