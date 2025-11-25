const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = function override(config, env) {
  if (env === 'production') {
    config.plugins.push(
      new JavaScriptObfuscator({
        // Rotación del array de strings para mayor seguridad
        rotateStringArray: true,
        
        // Convierte strings literales en un array codificado
        stringArray: true,
        stringArrayThreshold: 0.75,
        
        // Divide strings largos en chunks
        splitStrings: true,
        splitStringsChunkLength: 10,
        
        // Compacta el código
        compact: true,
        
        // Aplana el flujo de control para dificultar lectura
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        
        // Inyecta código muerto para confundir
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        
        // Protección contra debug (desactivado para no afectar performance)
        debugProtection: false,
        
        // Desactiva console.log en producción
        disableConsoleOutput: true,
        
        // Genera nombres de identificadores en hexadecimal
        identifierNamesGenerator: 'hexadecimal',
        
        // No renombra variables globales para evitar romper librerías
        renameGlobals: false,
        
        // Protección contra formateo/beautify
        selfDefending: true,
        
        // Transforma las claves de objetos
        transformObjectKeys: true,
        
        // No usa unicode escape para mantener tamaño razonable
        unicodeEscapeSequence: false
      }, [])
    );
  }
  return config;
};
