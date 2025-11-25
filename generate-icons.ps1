# Script para generar iconos web y móviles
# Requiere ImageMagick instalado: choco install imagemagick

Write-Host "🎨 Generando iconos para JustiConsulta..." -ForegroundColor Cyan

# Verificar si ImageMagick está instalado
$magick = Get-Command magick -ErrorAction SilentlyContinue
if (-not $magick) {
    Write-Host "❌ Error: ImageMagick no está instalado" -ForegroundColor Red
    Write-Host "Instalar con: choco install imagemagick" -ForegroundColor Yellow
    Write-Host "O descargar desde: https://imagemagick.org/script/download.php" -ForegroundColor Yellow
    exit 1
}

# Verificar que existe logo.svg
if (-not (Test-Path "public\logo.svg")) {
    Write-Host "❌ Error: No se encuentra public\logo.svg" -ForegroundColor Red
    exit 1
}

Write-Host "`n📱 Generando iconos WEB..." -ForegroundColor Green

# Iconos Web
magick public\logo.svg -resize 192x192 public\logo192.png
magick public\logo.svg -resize 512x512 public\logo512.png
magick public\logo.svg -resize 32x32 public\favicon-32.png
magick public\logo.svg -resize 16x16 public\favicon-16.png
magick public\favicon-32.png public\favicon-16.png public\favicon.ico

# Limpiar temporales
Remove-Item public\favicon-32.png, public\favicon-16.png

Write-Host "✅ favicon.ico creado (32x32, 16x16)" -ForegroundColor Green
Write-Host "✅ logo192.png creado" -ForegroundColor Green
Write-Host "✅ logo512.png creado" -ForegroundColor Green

Write-Host "`n📱 Generando iconos MÓVIL..." -ForegroundColor Green

# Crear directorio assets si no existe
if (-not (Test-Path "mobile\assets")) {
    New-Item -ItemType Directory -Path "mobile\assets" | Out-Null
}

# Iconos Móvil
magick public\logo.svg -resize 1024x1024 mobile\assets\icon.png
Copy-Item mobile\assets\icon.png mobile\assets\adaptive-icon.png

Write-Host "✅ icon.png creado (1024x1024)" -ForegroundColor Green
Write-Host "✅ adaptive-icon.png creado (1024x1024)" -ForegroundColor Green

Write-Host "`n🎨 Generando SPLASH SCREEN..." -ForegroundColor Green

# Splash Screen (fondo navy con logo centrado)
magick -size 1284x2778 xc:"#0F172A" mobile\assets\splash-bg.png
magick public\logo.svg -resize 400x400 mobile\assets\logo-splash.png
magick mobile\assets\splash-bg.png mobile\assets\logo-splash.png -gravity center -composite mobile\assets\splash.png

# Limpiar temporales
Remove-Item mobile\assets\splash-bg.png, mobile\assets\logo-splash.png

Write-Host "✅ splash.png creado (1284x2778)" -ForegroundColor Green

Write-Host "`n✨ ¡Todos los iconos generados exitosamente!" -ForegroundColor Cyan
Write-Host "`n📋 Archivos creados:" -ForegroundColor Yellow
Write-Host "  Web:" -ForegroundColor White
Write-Host "    - public/favicon.ico" -ForegroundColor Gray
Write-Host "    - public/logo192.png" -ForegroundColor Gray
Write-Host "    - public/logo512.png" -ForegroundColor Gray
Write-Host "  Móvil:" -ForegroundColor White
Write-Host "    - mobile/assets/icon.png" -ForegroundColor Gray
Write-Host "    - mobile/assets/adaptive-icon.png" -ForegroundColor Gray
Write-Host "    - mobile/assets/splash.png" -ForegroundColor Gray

Write-Host "`n🚀 Siguiente paso: Probar la app" -ForegroundColor Cyan
Write-Host "  Web: npm start" -ForegroundColor Gray
Write-Host "  Móvil: cd mobile && npm start" -ForegroundColor Gray
