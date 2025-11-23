import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Import screens
import LoginScreen from '../features/auth/screens/LoginScreen';
import RegisterScreen from '../features/auth/screens/RegisterScreen';
import RecoveryPasswordScreen from '../features/auth/screens/RecoveryPasswordScreen';
import ProcessConsultationScreen from '../features/processes/screens/ProcessConsultationScreen';
import ProcessDetailScreen from '../features/processes/screens/ProcessDetailScreen';
import ProcessHistoryScreen from '../features/processes/screens/ProcessHistoryScreen';
import MyProcessesScreen from '../features/processes/screens/MyProcessesScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "ProcessConsultation" : "Login"}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#003366',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          // Auth screens
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ title: 'Iniciar Sesión', headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ title: 'Registro' }}
            />
            <Stack.Screen 
              name="RecoveryPassword" 
              component={RecoveryPasswordScreen}
              options={{ title: 'Recuperar Contraseña' }}
            />
          </>
        ) : (
          // Main app screens
          <>
            <Stack.Screen 
              name="ProcessConsultation" 
              component={ProcessConsultationScreen}
              options={{ title: 'Consulta de Procesos' }}
            />
            <Stack.Screen 
              name="ProcessDetail" 
              component={ProcessDetailScreen}
              options={{ title: 'Detalle del Proceso' }}
            />
            <Stack.Screen 
              name="ProcessHistory" 
              component={ProcessHistoryScreen}
              options={{ title: 'Historial de Procesos' }}
            />
            <Stack.Screen 
              name="MyProcesses" 
              component={MyProcessesScreen}
              options={{ title: 'Mis Procesos' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
