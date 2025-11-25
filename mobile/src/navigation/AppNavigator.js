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
import NotificationsScreen from '../features/processes/screens/NotificationsScreen';
import NotificationDetailScreen from '../features/processes/screens/NotificationDetailScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "ProcessConsultation" : "Login"}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F172A',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitleVisible: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          // Auth screens
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ 
                title: 'Iniciar Sesión', 
                headerShown: false,
                animation: 'fade',
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ 
                title: 'Crear Cuenta',
                headerStyle: {
                  backgroundColor: '#0F172A',
                },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen 
              name="RecoveryPassword" 
              component={RecoveryPasswordScreen}
              options={{ 
                title: 'Recuperar Contraseña',
                headerStyle: {
                  backgroundColor: '#0F172A',
                },
                headerTintColor: '#fff',
              }}
            />
          </>
        ) : (
          // Main app screens
          <>
            <Stack.Screen 
              name="ProcessConsultation" 
              component={ProcessConsultationScreen}
              options={{ 
                title: 'JustiConsulta',
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="ProcessDetail" 
              component={ProcessDetailScreen}
              options={{ 
                title: 'Detalle del Proceso',
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="ProcessHistory" 
              component={ProcessHistoryScreen}
              options={{ 
                title: 'Historial',
                headerStyle: {
                  backgroundColor: '#0F172A',
                },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen 
              name="MyProcesses" 
              component={MyProcessesScreen}
              options={{ 
                title: 'Mis Procesos',
                headerStyle: {
                  backgroundColor: '#0F172A',
                },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen 
              name="Notifications" 
              component={NotificationsScreen}
              options={{ 
                title: 'Notificaciones',
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="NotificationDetail" 
              component={NotificationDetailScreen}
              options={{ 
                title: 'Detalle de Notificación',
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
