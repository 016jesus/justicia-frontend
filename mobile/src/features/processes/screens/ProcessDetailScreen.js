import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

const ProcessDetailScreen = ({ route, navigation }) => {
  const { processId } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Detalle del Proceso</Text>
        <Text style={styles.subtitle}>
          ID del Proceso: {processId || 'N/A'}
        </Text>
        <Text style={styles.description}>
          La funcionalidad de detalle de procesos será implementada próximamente.
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
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default ProcessDetailScreen;
