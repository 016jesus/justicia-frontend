# 🧪 Scripts de Testing de Performance

## Verificar las Optimizaciones

### 1. Build de Producción
```bash
npm run build
```

### 2. Analizar Bundle Size
```bash
# Ver tamaño de archivos generados
npm run build
cd build/static/js
ls -lh

# Analizar con source-map-explorer (instalar primero)
npm install -g source-map-explorer
source-map-explorer build/static/js/*.js
```

### 3. Servir Build Localmente
```bash
# Instalar serve si no lo tienes
npm install -g serve

# Servir la build
serve -s build

# Ahora abre: http://localhost:3000
```

### 4. Lighthouse Performance Test
```bash
# En Chrome DevTools:
# 1. Abre la app en modo incógnito
# 2. F12 > Lighthouse tab
# 3. Selecciona "Performance" + "Desktop" o "Mobile"
# 4. Click "Generate report"

# Target scores:
# Performance: 90+
# Accessibility: 90+
# Best Practices: 90+
# SEO: 90+
```

### 5. React DevTools Profiler
```bash
# 1. Instala React DevTools extension en Chrome
# 2. Abre la app con DevTools
# 3. Tab "Profiler"
# 4. Click "Record" 🔴
# 5. Interactúa con la app (navegar, filtrar, etc.)
# 6. Click "Stop" ⏹️
# 7. Analiza flamegraph y ranked chart

# Buscar:
# - Componentes que tardan mucho en renderizar
# - Re-renders innecesarios
# - Componentes sin memoizar que se renderizan frecuentemente
```

### 6. Network Performance
```bash
# Chrome DevTools > Network tab
# 1. Deshabilita cache (checkbox "Disable cache")
# 2. Throttling: "Fast 3G" o "Slow 3G"
# 3. Recarga la página
# 4. Observa:
#    - DOMContentLoaded (azul)
#    - Load (rojo)
#    - Tamaño total transferido
#    - Número de requests

# Targets:
# - DOMContentLoaded: < 1.5s
# - Load: < 3s
# - Transferred: < 1MB inicial
```

### 7. Web Vitals
```bash
# Instalar web-vitals
npm install web-vitals

# Agregar a src/index.js:
# import { reportWebVitals } from './reportWebVitals';
# reportWebVitals(console.log);

# Métricas clave:
# - LCP (Largest Contentful Paint): < 2.5s
# - FID (First Input Delay): < 100ms
# - CLS (Cumulative Layout Shift): < 0.1
# - TTFB (Time to First Byte): < 600ms
```

## Testing de Memoización

### Test Manual
```javascript
// Agregar temporalmente a componentes para debug
console.log('[ComponentName] rendered');

// Con React DevTools Profiler:
// 1. Graba una sesión
// 2. Interactúa con la app
// 3. Verifica qué componentes se re-renderizan
// 4. Los memoizados NO deberían aparecer si sus props no cambiaron
```

### Test Automatizado (opcional)
```bash
# Instalar React Testing Library
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Crear test para verificar que componentes no se re-renderizan
# Ver ejemplo en src/components/__tests__/performance.test.js
```

## Comparación Antes/Después

### Hacer Baseline ANTES de optimizaciones
```bash
# 1. Hacer checkout a commit antes de optimizaciones
git checkout <commit-antes-optimizaciones>

# 2. Build y medir
npm run build
# Anotar:
# - Tamaño de bundle
# - Lighthouse score
# - Time to Interactive

# 3. Volver a commit actual
git checkout main
```

### Medir DESPUÉS de optimizaciones
```bash
npm run build
# Comparar métricas con baseline
```

## Monitoreo Continuo

### Lighthouse CI (para CI/CD)
```bash
# Instalar Lighthouse CI
npm install -g @lhci/cli

# Configurar
lhci autorun --collect.url=http://localhost:3000

# Integrar en CI/CD para verificar que performance no degrada
```

### Performance Budget
```json
// Crear .lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "performance": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "interactive": ["error", { "maxNumericValue": 3500 }],
        "total-byte-weight": ["error", { "maxNumericValue": 1000000 }]
      }
    }
  }
}
```

## Comandos de Debugging

### Ver qué se carga en cada chunk
```bash
npm run build
# Inspeccionar build/static/js/
# Deberías ver múltiples archivos .js (cada página es un chunk)
```

### Verificar lazy loading
```bash
# En Chrome DevTools > Network
# 1. Recarga la página de login
# 2. Solo debería cargar el chunk de LoginPage
# 3. Navega a /consultas
# 4. Debería cargar chunk de ProcessConsultationPage bajo demanda
```

### Memory Leaks
```bash
# Chrome DevTools > Memory
# 1. Tab "Memory"
# 2. Toma heap snapshot
# 3. Usa la app intensivamente
# 4. Toma otro heap snapshot
# 5. Compara: memory debería ser similar
# Si crece mucho: hay memory leak
```

## Checklist de Verificación

- [ ] Build genera múltiples chunks (code splitting funcionando)
- [ ] Lighthouse Performance > 90
- [ ] LCP < 2.5s
- [ ] TTI < 3.5s
- [ ] Bundle inicial < 500KB (gzipped)
- [ ] Componentes memoizados no se re-renderizan innecesariamente
- [ ] Cache funciona (requests repetidas vienen de cache)
- [ ] No hay memory leaks evidentes
- [ ] App es usable en Fast 3G
- [ ] No hay errores en consola

## Recursos
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Web Vitals](https://web.dev/vitals/)
- [Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)
