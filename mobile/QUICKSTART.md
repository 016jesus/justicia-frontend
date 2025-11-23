# Quick Start Guide - JustiConsulta Mobile

Esta es una guía rápida para comenzar con la aplicación móvil.

## 🚀 Setup en 3 Pasos

### 1. Instalar Dependencias
```bash
cd mobile
npm install
```

### 2. Ejecutar la App
```bash
npm start
```

### 3. Abrir en tu Dispositivo
- **Opción A**: Escanea el QR con Expo Go app
- **Opción B**: Presiona `a` para Android emulator
- **Opción C**: Presiona `i` para iOS simulator (solo Mac)

## 📱 Probar Login

### Credenciales de Prueba
Usa las mismas credenciales que en la versión web.

### Flujo de Login
1. Abre la app → Pantalla de Login
2. Ingresa email y contraseña
3. Presiona "Iniciar Sesión"
4. ✅ Navega a pantalla principal

## 🎯 Características Disponibles

### ✅ Funcionando
- Login con validación completa
- Persistencia de sesión
- Navegación entre pantallas
- Cerrar sesión

### 🚧 En Desarrollo
- Registro de usuario
- Recuperación de contraseña
- Consulta de procesos
- Detalle de procesos

## 📖 Estructura del Código

```
mobile/src/
├── config/           # Configuración (API URL, etc.)
├── context/          # AuthContext con AsyncStorage
├── navigation/       # React Navigation setup
├── services/         # APIClient con Axios
└── features/
    ├── auth/         # Login, Register, Recovery
    │   ├── screens/
    │   └── services/validation/
    └── processes/    # Procesos judiciales
        └── screens/
```

## 🔧 Comandos Útiles

```bash
# Limpiar caché
npm start -c

# Ver logs
npm start

# Reinstalar dependencias
rm -rf node_modules && npm install
```

## 📚 Más Información

- **README.md**: Documentación completa
- **TESTING.md**: Guía de pruebas
- **SUMMARY.md**: Resumen de migración
- **../MIGRATION.md**: Guía de migración web → mobile

## 🐛 Problemas Comunes

### La app no se conecta
- Verifica que estés en la misma red WiFi
- Revisa la URL del backend en `src/config/constants.js`

### Error al instalar dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

### La app no carga
```bash
npm start -c  # Limpia la caché
```

## 💡 Tips

1. **Agitar el dispositivo** para abrir el menú de desarrollo
2. **Cmd+D (iOS) / Cmd+M (Android)** en emulador para debug menu
3. **Recargar**: Cmd+R (iOS) / RR (Android)
4. Los **logs** aparecen en la terminal donde ejecutaste `npm start`

## 🎓 Aprender Más

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Tutorial](https://reactnative.dev/docs/tutorial)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

## ✉️ Soporte

Para preguntas o problemas:
1. Revisa TESTING.md para casos de prueba
2. Revisa SUMMARY.md para detalles técnicos
3. Consulta el equipo de desarrollo

---

**¡Feliz desarrollo! 🚀**
