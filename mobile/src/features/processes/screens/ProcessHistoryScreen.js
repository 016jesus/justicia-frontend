import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

const ProcessHistoryScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Historial de Procesos</Text>
        <Text style={styles.subtitle}>
          La funcionalidad de historial de procesos será implementada próximamente.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    lineHeight: 24,
  },
});

export default ProcessHistoryScreen;
