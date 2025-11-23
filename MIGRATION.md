# Migración a React Native - JustiConsulta

Este documento describe la migración del proyecto JustiConsulta de React Web a React Native para dispositivos móviles.

## Estructura del Proyecto

El proyecto ahora contiene dos aplicaciones independientes:

```
justicia-frontend/
├── src/                    # Aplicación Web (React)
├── public/                 # Recursos públicos Web
├── package.json           # Dependencias Web
├── mobile/                # Aplicación Móvil (React Native)
│   ├── src/              # Código fuente móvil
│   ├── assets/           # Recursos móviles
│   ├── App.js            # Punto de entrada móvil
│   ├── package.json      # Dependencias móviles
│   └── README.md         # Documentación móvil
└── README.md             # Documentación general
```

## Aplicación Web

### Ubicación
La aplicación web permanece en el directorio raíz del proyecto, sin modificaciones.

### Ejecución
```bash
npm install
npm start
```

### Características
- React 19.2.0
- React Router DOM para navegación
- Bootstrap para estilos
- localStorage para persistencia
- Axios para llamadas API

## Aplicación Móvil

### Ubicación
La aplicación móvil está en el directorio `mobile/`.

### Ejecución
```bash
cd mobile
npm install
npm start
```

### Características
- React Native 0.81.5
- Expo SDK 54
- React Navigation para navegación
- AsyncStorage para persistencia
- Axios para llamadas API (mismo backend)

## Arquitectura Compartida

Ambas aplicaciones comparten la misma arquitectura y estructura lógica:

### 1. Autenticación
- **Web**: `src/context/AuthContext.js` con localStorage
- **Mobile**: `mobile/src/context/AuthContext.js` con AsyncStorage

### 2. Servicios API
- **Web**: `src/services/APIClient.js`
- **Mobile**: `mobile/src/services/APIClient.js`
- Ambos apuntan al mismo backend: `https://proyecto-justiconsulta.onrender.com`

### 3. Validación de Formularios
- Ambos usan `react-hook-form` + `zod`
- **Web**: `src/features/auth/services/validation/`
- **Mobile**: `mobile/src/features/auth/services/validation/`

### 4. Estructura de Features
```
features/
├── auth/
│   ├── screens/ (Pages/ en web)
│   ├── components/
│   └── services/
└── processes/
    ├── screens/ (Pages/ en web)
    └── components/
```

## Diferencias Principales

| Aspecto | Web | Mobile |
|---------|-----|--------|
| **Framework** | React | React Native + Expo |
| **Navegación** | React Router DOM | React Navigation |
| **Almacenamiento** | localStorage | AsyncStorage |
| **Estilos** | CSS/Bootstrap | StyleSheet API |
| **Componentes** | HTML + Bootstrap | Componentes nativos RN |
| **Formularios** | HTML inputs | TextInput, Picker, etc. |

## Estado de Implementación

### Implementado ✅
- [x] Estructura base de la app móvil
- [x] Configuración de Expo
- [x] Sistema de navegación (React Navigation)
- [x] AuthContext adaptado para mobile
- [x] APIClient adaptado para mobile
- [x] Validación de formularios (LoginSchema, RegisterSchema)
- [x] Pantalla de Login funcional
- [x] Pantallas placeholder para otras features

### Pendiente 🚧
- [ ] Implementación completa de Register
- [ ] Implementación completa de RecoveryPassword
- [ ] Migración de consulta de procesos
- [ ] Migración de detalle de proceso
- [ ] Migración de historial de procesos
- [ ] Migración de mis procesos
- [ ] Componentes compartidos (gráficos, tablas)
- [ ] Sistema de caché de datos
- [ ] Optimizaciones de rendimiento
- [ ] Pruebas unitarias e integración

## Guía de Migración de Componentes

### De Web a Mobile

#### 1. Componentes de UI

**Web (HTML/Bootstrap):**
```jsx
<div className="container">
  <button className="btn btn-primary">Click me</button>
</div>
```

**Mobile (React Native):**
```jsx
<View style={styles.container}>
  <TouchableOpacity style={styles.button}>
    <Text style={styles.buttonText}>Click me</Text>
  </TouchableOpacity>
</View>
```

#### 2. Navegación

**Web (React Router):**
```jsx
const navigate = useNavigate();
navigate('/consultas');
```

**Mobile (React Navigation):**
```jsx
navigation.navigate('ProcessConsultation');
```

#### 3. Almacenamiento

**Web (localStorage):**
```jsx
localStorage.setItem('token', token);
const token = localStorage.getItem('token');
```

**Mobile (AsyncStorage):**
```jsx
await AsyncStorage.setItem('token', token);
const token = await AsyncStorage.getItem('token');
```

#### 4. Estilos

**Web (CSS):**
```css
.container {
  display: flex;
  padding: 20px;
  background-color: #fff;
}
```

**Mobile (StyleSheet):**
```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  }
});
```

## Configuración del Backend

Ambas aplicaciones se conectan al mismo backend:
- URL: `https://proyecto-justiconsulta.onrender.com`
- API Key: `APP-CLIENT-a20ceb8b-b6c3-4620-a560-45c39746a30c`

No se requieren cambios en el backend para soportar la aplicación móvil.

## Desarrollo en Paralelo

### Para trabajar en Web:
```bash
# En el directorio raíz
npm start
```

### Para trabajar en Mobile:
```bash
# En el directorio mobile
cd mobile
npm start
```

Ambas aplicaciones pueden ejecutarse simultáneamente sin conflictos.

## Pruebas

### Web
```bash
npm test
```

### Mobile
```bash
cd mobile
npm test
```

## Construcción para Producción

### Web
```bash
npm run build
# Genera build/ con archivos estáticos
```

### Mobile
```bash
cd mobile
# Para Android
expo build:android

# Para iOS
expo build:ios
```

## Próximos Pasos

1. **Corto plazo**: Completar las pantallas de autenticación
2. **Mediano plazo**: Migrar todas las funcionalidades de procesos
3. **Largo plazo**: Optimizar, testear y publicar en las tiendas

## Recursos Adicionales

- [Documentación de React Native](https://reactnative.dev/)
- [Documentación de Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

## Contacto y Soporte

Para preguntas o problemas relacionados con la migración, contactar al equipo de desarrollo.
