# 📱 Guía de Pruebas y Desarrollo Móvil - JustiConsulta

## 🚀 Probar la App sin Compilar APK (Expo Go)

### Opción 1: Expo Go (Recomendado para desarrollo)

**Ventajas:**
- ✅ No necesitas compilar APK
- ✅ Hot reload en tiempo real
- ✅ Pruebas instantáneas
- ✅ Funciona en Android e iOS

**Pasos:**

1. **Instalar Expo Go en tu dispositivo móvil:**
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Iniciar el servidor de desarrollo:**
   ```powershell
   cd mobile
   npm start
   ```

3. **Conectar tu dispositivo:**
   
   **Método A - Escanear QR:**
   - Asegúrate de que tu PC y móvil estén en la misma red WiFi
   - Escanea el QR que aparece en la terminal con:
     - **Android:** App Expo Go (botón "Scan QR Code")
     - **iOS:** Cámara nativa del iPhone

   **Método B - Conexión manual (si el QR no funciona):**
   ```powershell
   # En la terminal donde corre Expo, presiona 's' para cambiar a modo tunnel
   npm start --tunnel
   ```

4. **Ver logs en tiempo real:**
   - Los logs aparecen en la terminal
   - También puedes sacudir el dispositivo y seleccionar "Debug Remote JS"

### Opción 2: Emulador Android Studio

```powershell
# Iniciar emulador de Android
npx expo start --android
```

### Opción 3: Build de Desarrollo (si Expo Go no funciona)

```powershell
# Build de desarrollo (más rápido que APK de producción)
npx expo run:android
```

---

## 🔧 Solución al Error 403

### Causa del Problema

El backend requiere un header `X-API-KEY` en **todas las peticiones**. En desarrollo web funciona porque está configurado en el `.env`, pero en móvil puede fallar si:

1. El `API_KEY` no está correctamente definido
2. Los headers no se están enviando en todas las peticiones
3. Hay problemas de red o CORS

### Verificaciones Realizadas

✅ **APIClient.js configurado correctamente:**
```javascript
headers: {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY
}
```

✅ **constants.js tiene la API_KEY:**
```javascript
export const API_KEY = 'APP-CLIENT-a20ceb8b-b6c3-4620-a560-45c39746a30c';
```

✅ **Interceptor maneja Authorization correctamente:**
- Elimina Authorization en endpoints `/auth/*`
- Mantiene `X-API-KEY` en todas las peticiones

### Cómo Verificar si el Error Persiste

1. **Ver logs detallados:**
   ```javascript
   // En AuthContext.js login():
   console.log('Request headers:', apiClient.defaults.headers);
   console.log('Enviando a:', API_BASE_URL + '/api/auth/login');
   ```

2. **Probar endpoint directamente:**
   ```powershell
   # Desde Postman o curl
   curl -X POST https://jesucripto.win/api/auth/login \
     -H "Content-Type: application/json" \
     -H "X-API-KEY: APP-CLIENT-a20ceb8b-b6c3-4620-a560-45c39746a30c" \
     -d '{"email":"test@test.com","password":"Test123!"}'
   ```

3. **Verificar conectividad:**
   ```javascript
   // Agregar en login() antes de la llamada API:
   try {
     const testResponse = await fetch('https://jesucripto.win/api/health');
     console.log('Backend accesible:', testResponse.ok);
   } catch (e) {
     console.error('Backend no accesible:', e);
   }
   ```

### Si el Error Continúa

**Posibles causas adicionales:**

1. **Certificado SSL en móvil:**
   - Android puede bloquear certificados autofirmados
   - Solución: Agregar a `app.json`:
     ```json
     "android": {
       "usesCleartextTraffic": true
     }
     ```

2. **CORS en el backend:**
   - Verificar que el backend acepte peticiones desde dominios externos
   - El header `X-API-KEY` debe estar en la lista de headers permitidos

3. **Timeout de red:**
   - El timeout está en 60 segundos, puede ser demasiado
   - Reducir a 30 segundos y manejar el error mejor

---

## 🐛 Debugging Avanzado

### Ver todos los requests

Agregar en `APIClient.js`:

```javascript
apiClient.interceptors.request.use((config) => {
  console.log('📤 REQUEST:', {
    method: config.method,
    url: config.baseURL + config.url,
    headers: config.headers,
    data: config.data
  });
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ RESPONSE:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ ERROR:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);
```

### Logs de AsyncStorage

```javascript
// Ver qué hay almacenado
import AsyncStorage from '@react-native-async-storage/async-storage';

const debugStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const items = await AsyncStorage.multiGet(keys);
  console.log('📦 AsyncStorage:', items);
};
```

---

## 📝 Comandos Útiles

```powershell
# Ver dispositivos conectados
adb devices

# Ver logs de Android en tiempo real
adb logcat | Select-String "ReactNativeJS"

# Limpiar caché de Expo
npx expo start --clear

# Reinstalar dependencias
cd mobile
Remove-Item -Recurse -Force node_modules
npm install

# Ver qué está usando el puerto 19000 (Expo)
netstat -ano | findstr :19000
```

---

## 🎯 Checklist para Pruebas

Antes de reportar un error, verifica:

- [ ] Estás en la misma red WiFi (PC y móvil)
- [ ] Expo Go está actualizado
- [ ] El servidor está corriendo (`npm start` en /mobile)
- [ ] No hay firewall bloqueando el puerto 19000
- [ ] El backend está accesible (https://jesucripto.win)
- [ ] Limpiaste la caché (`npx expo start --clear`)

---

## 🆘 Problemas Comunes

### "Unable to resolve module"
```powershell
npx expo start --clear
```

### "Network request failed"
- Verificar que el móvil tenga internet
- Verificar que el backend esté online
- Probar con `--tunnel` si están en redes diferentes

### "Cannot connect to Metro"
```powershell
# Matar procesos de Expo
Get-Process | Where-Object {$_.ProcessName -like "*expo*"} | Stop-Process -Force
npx expo start
```

### QR Code no funciona
```powershell
# Usar modo tunnel
npx expo start --tunnel

# O copiar la URL manualmente y pegarla en Expo Go
# exp://192.168.x.x:19000
```

---

## 📚 Recursos

- [Documentación Expo Go](https://docs.expo.dev/get-started/expo-go/)
- [Debugging en React Native](https://reactnative.dev/docs/debugging)
- [Expo Troubleshooting](https://docs.expo.dev/troubleshooting/overview/)

---

## ✅ Estado Actual del Proyecto

### Implementado
- ✅ LoginScreen con validación Zod
- ✅ AuthContext con AsyncStorage
- ✅ APIClient con interceptores
- ✅ Navegación con React Navigation
- ✅ API_KEY configurada correctamente

### En Desarrollo
- 🔄 RegisterScreen (estructura básica)
- 🔄 RecoveryPasswordScreen (estructura básica)
- 🔄 Pantallas de procesos (estructura básica)

### Por Implementar
- ⏳ Consulta de procesos funcional
- ⏳ Historial de consultas
- ⏳ Mis procesos asociados
- ⏳ Notificaciones push
- ⏳ Modo offline

---

**Última actualización:** Noviembre 24, 2025
