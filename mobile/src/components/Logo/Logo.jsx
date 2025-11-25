import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const Logo = ({ width = 120, height = 120 }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 200 200" fill="none">
        {/* Balanza - Símbolo de justicia */}
        <G transform="translate(100, 100)">
          {/* Plato izquierdo */}
          <Path
            d="M-50,-20 Q-50,-15 -45,-15 L-25,-15 Q-20,-15 -20,-20 L-22,-25 L-48,-25 Z"
            fill="#D97706"
            stroke="#0F172A"
            strokeWidth="2"
          />
          {/* Plato derecho */}
          <Path
            d="M20,-20 Q20,-15 25,-15 L45,-15 Q50,-15 50,-20 L48,-25 L22,-25 Z"
            fill="#D97706"
            stroke="#0F172A"
            strokeWidth="2"
          />
          {/* Soporte central */}
          <Path
            d="M-2,0 L-2,-50 L2,-50 L2,0 Z"
            fill="#0F172A"
          />
          {/* Travesaño horizontal */}
          <Path
            d="M-55,-50 L55,-50 L55,-46 L-55,-46 Z"
            fill="#0F172A"
          />
          {/* Cadena izquierda */}
          <Path
            d="M-35,-46 L-35,-25"
            stroke="#0F172A"
            strokeWidth="1.5"
          />
          {/* Cadena derecha */}
          <Path
            d="M35,-46 L35,-25"
            stroke="#0F172A"
            strokeWidth="1.5"
          />
          {/* Base */}
          <Path
            d="M-25,0 Q-25,5 -20,5 L20,5 Q25,5 25,0 L25,-3 L-25,-3 Z"
            fill="#0F172A"
          />
          {/* Círculo superior - detalle */}
          <Path
            d="M-5,-50 Q-5,-55 0,-55 Q5,-55 5,-50 Q5,-45 0,-45 Q-5,-45 -5,-50 Z"
            fill="#D97706"
            stroke="#0F172A"
            strokeWidth="1"
          />
        </G>
        
        {/* Círculo exterior decorativo */}
        <Path
          d="M100,20 A80,80 0 1,1 100,180 A80,80 0 1,1 100,20"
          stroke="#D97706"
          strokeWidth="3"
          fill="none"
          opacity="0.3"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Logo;
