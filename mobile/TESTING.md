# Testing Guide - JustiConsulta Mobile

Esta guía describe cómo probar la aplicación móvil de JustiConsulta.

## Prerequisitos

1. Instalar Node.js (versión 14+)
2. Instalar Expo Go en tu dispositivo móvil:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

## Instalación

```bash
cd mobile
npm install
```

## Ejecutar la Aplicación

```bash
npm start
```

Esto abrirá Expo DevTools. Opciones disponibles:
- Escanear código QR con Expo Go
- Presionar `a` para abrir en emulador Android
- Presionar `i` para abrir en simulador iOS (solo Mac)
- Presionar `w` para abrir en navegador web

## Pruebas Funcionales

### 1. Pantalla de Login

**Escenario: Login Exitoso**
- Navegar a la pantalla de login (pantalla inicial)
- Ingresar email válido: `test@example.com`
- Ingresar contraseña válida: `Test123!@#`
- Presionar "Iniciar Sesión"
- **Resultado Esperado**: Navegar a ProcessConsultationScreen

**Escenario: Validación de Email**
- Ingresar email inválido: `invalid-email`
- **Resultado Esperado**: Mostrar error "El formato del correo electrónico es inválido."

**Escenario: Validación de Contraseña**
- Ingresar contraseña corta: `123`
- **Resultado Esperado**: Mostrar error "La contraseña debe tener al menos 8 caracteres."

**Escenario: Error de API**
- Ingresar credenciales incorrectas
- **Resultado Esperado**: Mostrar mensaje de error del servidor

### 2. Navegación

**Escenario: Navegación a Registro**
- Desde Login, presionar "¿No tienes cuenta? Regístrate"
- **Resultado Esperado**: Navegar a RegisterScreen

**Escenario: Navegación a Recuperar Contraseña**
- Desde Login, presionar "¿Olvidaste tu contraseña?"
- **Resultado Esperado**: Navegar a RecoveryPasswordScreen

**Escenario: Volver a Login**
- Desde Register o RecoveryPassword, presionar "Volver a Iniciar Sesión"
- **Resultado Esperado**: Navegar de vuelta a LoginScreen

### 3. Autenticación Persistente

**Escenario: Mantener Sesión**
- Iniciar sesión exitosamente
- Cerrar la app completamente
- Reabrir la app
- **Resultado Esperado**: Mantener sesión y mostrar ProcessConsultationScreen

**Escenario: Cerrar Sesión**
- Desde ProcessConsultationScreen, presionar "Cerrar Sesión"
- **Resultado Esperado**: Limpiar datos y navegar a LoginScreen

### 4. Pantallas de Procesos

**Escenario: Consulta de Procesos**
- Iniciar sesión exitosamente
- **Resultado Esperado**: Ver ProcessConsultationScreen con mensaje de bienvenida

**Escenario: Navegar a Historial**
- Desde ProcessConsultationScreen, presionar "Historial de Procesos"
- **Resultado Esperado**: Navegar a ProcessHistoryScreen

**Escenario: Navegar a Mis Procesos**
- Desde ProcessConsultationScreen, presionar "Mis Procesos"
- **Resultado Esperado**: Navegar a MyProcessesScreen

## Pruebas de UI/UX

### Responsive Design
- Probar en diferentes tamaños de pantalla
- Verificar que los elementos sean legibles
- Verificar que los botones sean accesibles

### Teclado
- Verificar que el teclado no cubra los inputs
- Verificar que se puede hacer scroll cuando el teclado está visible
- Verificar que el tipo de teclado sea apropiado (email, password, etc.)

### Indicadores de Carga
- Verificar que se muestre un indicador durante el login
- Verificar que los botones se deshabiliten durante operaciones asíncronas

### Mensajes de Error
- Verificar que los errores sean visibles y legibles
- Verificar que los errores desaparezcan cuando se corrigen

## Pruebas de Integración con API

### Endpoints Probados
- `POST /api/auth/login` - Login de usuario
- `POST /api/users/by-email` - Obtener datos de usuario

### Headers Verificados
- `Content-Type: application/json`
- `X-API-KEY: APP-CLIENT-a20ceb8b-b6c3-4620-a560-45c39746a30c`
- `Authorization: Bearer <token>` (después de login)

## Pruebas de Almacenamiento

### AsyncStorage
- Verificar que el token se guarde después de login
- Verificar que el email se guarde después de login
- Verificar que los datos se eliminen después de logout
- Verificar que los datos persistan después de reiniciar la app

## Problemas Conocidos

### Pantallas Pendientes
Las siguientes pantallas muestran mensajes placeholder:
- RegisterScreen
- RecoveryPasswordScreen
- ProcessConsultationScreen (funcionalidad limitada)
- ProcessDetailScreen
- ProcessHistoryScreen
- MyProcessesScreen

Estos serán implementados en futuras iteraciones.

## Reportar Bugs

Al reportar bugs, incluir:
1. Descripción del problema
2. Pasos para reproducir
3. Resultado esperado vs. resultado actual
4. Capturas de pantalla (si aplica)
5. Dispositivo y versión de OS
6. Logs de consola

## Logs y Debugging

Para ver logs en la consola:
```bash
# En la terminal donde ejecutaste npm start
# Los logs aparecerán automáticamente
```

Para debugging avanzado:
1. Agitar el dispositivo (o Cmd+D en iOS, Cmd+M en Android)
2. Seleccionar "Debug Remote JS"
3. Abrir Chrome DevTools

## Performance

### Métricas a Monitorear
- Tiempo de carga inicial
- Tiempo de respuesta de login
- Uso de memoria
- Batería

### Optimizaciones Implementadas
- Lazy loading de pantallas
- Memoización de contextos
- Validación eficiente de formularios

## Próximos Pasos de Testing

1. Agregar pruebas unitarias con Jest
2. Agregar pruebas de integración con React Native Testing Library
3. Agregar pruebas E2E con Detox
4. Configurar CI/CD para pruebas automáticas
5. Agregar análisis de cobertura de código

## Recursos

- [Expo Testing](https://docs.expo.dev/guides/testing/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest](https://jestjs.io/)
