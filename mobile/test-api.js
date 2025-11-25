// Script de prueba para verificar que el API_KEY funciona
// Ejecutar: node mobile/test-api.js

const API_BASE_URL = 'https://jesucripto.win';
const API_KEY = 'APP-CLIENT-a20ceb8b-b6c3-4620-a560-45c39746a30c';

console.log('🧪 Probando conexión al backend...\n');

fetch(API_BASE_URL + '/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': API_KEY
  },
  body: JSON.stringify({
    username: 'test@test.com',
    password: 'wrongpassword'
  })
})
.then(res => {
  console.log('📊 Status:', res.status);
  console.log('📋 Headers recibidos:');
  res.headers.forEach((value, key) => {
    console.log(`  ${key}: ${value}`);
  });
  return res.text();
})
.then(text => {
  console.log('\n📄 Respuesta:', text || '(vacía)');
  console.log('\n✅ Si ves status 401 o 400 = API_KEY funciona (credenciales incorrectas)');
  console.log('❌ Si ves status 403 = API_KEY NO funciona\n');
})
.catch(err => {
  console.error('❌ Error:', err.message);
});
