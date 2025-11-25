# 🎨 Guía para Generar Iconos de la Aplicación

## 📋 Iconos Necesarios

### Web (React)
- `favicon.ico` - 32x32, 16x16
- `logo192.png` - 192x192
- `logo512.png` - 512x512

### Móvil (React Native / Expo)
- `icon.png` - 1024x1024 (requerido por Expo)
- `adaptive-icon.png` - 1024x1024 (Android adaptive icon)
- `splash.png` - 1284x2778 (splash screen)

---

## 🚀 Método 1: Usar Herramientas Online (Recomendado)

### Opción A: favicon.io
1. Ir a [favicon.io](https://favicon.io/)
2. Usar "PNG to ICO" para convertir logo.svg a favicon.ico
3. Descargar y colocar en `/public/`

### Opción B: Real Favicon Generator
1. Ir a [realfavicongenerator.net](https://realfavicongenerator.net/)
2. Subir `public/logo.svg`
3. Ajustar opciones:
   - **iOS**: Fondo #0F172A
   - **Android**: Fondo #0F172A, Margen 10%
   - **Windows**: Color #D97706
4. Generar y descargar todos los iconos
5. Extraer archivos a `/public/`

### Opción C: Expo Icon Generator (Para Móvil)
1. Usar el SVG en `/public/logo.svg`
2. Convertir a PNG 1024x1024 usando:
   - [CloudConvert](https://cloudconvert.com/svg-to-png)
   - [SVG to PNG Converter](https://svgtopng.com/)
3. Guardar como `/mobile/assets/icon.png`
4. Duplicar como `/mobile/assets/adaptive-icon.png`

---

## 🔧 Método 2: Usar Comandos (Requiere ImageMagick)

### Instalar ImageMagick
```powershell
# Windows (con Chocolatey)
choco install imagemagick

# O descargar desde: https://imagemagick.org/script/download.php
```

### Generar Iconos Web
```powershell
cd public

# Convertir SVG a PNG de diferentes tamaños
magick logo.svg -resize 192x192 logo192.png
magick logo.svg -resize 512x512 logo512.png
magick logo.svg -resize 32x32 favicon-32.png
magick logo.svg -resize 16x16 favicon-16.png

# Crear favicon.ico con múltiples tamaños
magick favicon-32.png favicon-16.png favicon.ico

# Limpiar archivos temporales
Remove-Item favicon-32.png, favicon-16.png
```

### Generar Iconos Móvil
```powershell
cd mobile/assets

# Copiar logo.svg desde public
Copy-Item ..\..\public\logo.svg .\logo.svg

# Generar icon.png (1024x1024)
magick logo.svg -resize 1024x1024 icon.png

# Generar adaptive-icon.png (igual que icon.png)
Copy-Item icon.png adaptive-icon.png

# Limpiar SVG temporal
Remove-Item logo.svg
```

---

## 🎨 Método 3: Usar Figma (Diseño Personalizado)

### Preparación
1. Abrir Figma
2. Crear nuevo archivo
3. Crear frame de 512x512

### Crear Icono
1. Agregar rectángulo redondeado (512x512, radius 100)
2. Color: #0F172A
3. Agregar balanza de justicia (copiar paths del SVG)
4. Color balanza: #D97706
5. Agregar texto "JC" (80px, bold, #FBBF24)

### Exportar
**Web:**
- Seleccionar frame
- Exportar como PNG:
  - @1x = 192x192 → `logo192.png`
  - @2x = 512x512 → `logo512.png`
  - favicon: 32x32 y 16x16
- Usar favicon.io para crear `favicon.ico`

**Móvil:**
- Exportar como PNG 1024x1024 → `icon.png`
- Duplicar como `adaptive-icon.png`

---

## 📱 Splash Screen para Móvil

### Crear Splash Screen Simple
```powershell
cd mobile/assets

# Crear fondo navy con logo centrado (1284x2778 para iPhone)
magick -size 1284x2778 xc:"#0F172A" splash-bg.png
magick ../../public/logo.svg -resize 400x400 logo-splash.png
magick splash-bg.png logo-splash.png -gravity center -composite splash.png

# Limpiar temporales
Remove-Item splash-bg.png, logo-splash.png
```

---

## ✅ Estructura Final de Archivos

```
justicia-frontend/
├── public/
│   ├── favicon.ico          ✅ 32x32, 16x16
│   ├── logo.svg             ✅ SVG fuente
│   ├── logo192.png          ⏳ Generar
│   ├── logo512.png          ⏳ Generar
│   ├── index.html
│   └── manifest.json        ✅ Actualizado
│
└── mobile/
    ├── app.json             ✅ Actualizado
    └── assets/
        ├── icon.png         ⏳ Generar (1024x1024)
        ├── adaptive-icon.png⏳ Generar (1024x1024)
        └── splash.png       ⏳ Generar (1284x2778)
```

---

## 🎯 Solución Rápida (Sin Herramientas)

Si no tienes tiempo o herramientas, usa estos servicios online:

### 1. Para TODOS los iconos web:
- [favicon.io/favicon-converter](https://favicon.io/favicon-converter/)
- Subir `logo.svg`
- Descargar package completo
- Extraer a `/public/`

### 2. Para iconos móviles:
- [appicon.co](https://appicon.co/)
- Subir `logo.svg` convertido a PNG 1024x1024
- Seleccionar "iOS" y "Android"
- Descargar y extraer a `/mobile/assets/`

---

## 🔍 Verificar Iconos

### Web
1. Abrir DevTools (F12)
2. Application → Manifest
3. Verificar que aparezcan los 3 iconos
4. Ver favicon en pestaña del navegador

### Móvil
```powershell
cd mobile
npx expo start

# En el dispositivo:
# - Ver el icono de la app en el launcher
# - Ver splash screen al abrir
```

---

## 🎨 Personalización del Logo

El archivo `public/logo.svg` contiene:
- **Fondo Navy (#0F172A)**: Color principal de marca
- **Balanza Gold (#D97706)**: Símbolo de justicia
- **Iniciales "JC" (#FBBF24)**: Identificador rápido

Para modificar:
1. Abrir `logo.svg` en editor de texto
2. Cambiar colores en atributos `fill`
3. Ajustar tamaños en atributos `width`, `height`, `font-size`
4. Regenerar iconos con los métodos anteriores

---

## 📝 Checklist

- [ ] Crear logo.svg en `/public/`
- [ ] Generar favicon.ico
- [ ] Generar logo192.png
- [ ] Generar logo512.png
- [ ] Actualizar manifest.json
- [ ] Generar icon.png para móvil (1024x1024)
- [ ] Generar adaptive-icon.png para Android
- [ ] Generar splash.png para móvil
- [ ] Actualizar app.json
- [ ] Probar en navegador web
- [ ] Probar en Expo Go
- [ ] Compilar APK y verificar icono

---

## 🆘 Problemas Comunes

**Favicon no aparece:**
- Limpiar caché del navegador (Ctrl+Shift+Del)
- Hard refresh (Ctrl+F5)
- Verificar que favicon.ico esté en `/public/`

**Icono móvil no se ve:**
- Verificar que icon.png sea exactamente 1024x1024
- Desinstalar app del dispositivo
- Reinstalar desde Expo Go
- Si usas APK compilado, regenerar build

**Colores se ven mal:**
- Verificar que el PNG tenga fondo transparent si usas adaptive-icon
- O usar fondo #0F172A si prefieres fondo sólido

---

**Última actualización:** Noviembre 24, 2025
