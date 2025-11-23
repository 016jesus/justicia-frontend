import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';

const ProcessConsultationScreen = ({ navigation }) => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout(navigation.navigate);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Bienvenido, {user?.firstName || 'Usuario'}
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Consulta de Procesos</Text>
        <Text style={styles.subtitle}>
          La funcionalidad de consulta de procesos será implementada próximamente.
        </Text>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('ProcessHistory')}
          >
            <Text style={styles.menuItemText}>Historial de Procesos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MyProcesses')}
          >
            <Text style={styles.menuItemText}>Mis Procesos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#003366',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItemText: {
    fontSize: 18,
    color: '#003366',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ProcessConsultationScreen;
