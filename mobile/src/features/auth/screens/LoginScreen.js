import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '../services/validation/LoginSchema';

const LoginScreen = ({ navigation }) => {
  const { login, loading, error } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      await login(data, navigation.navigate);
    } catch (err) {
      Alert.alert('Error', err.message || 'Error durante el login');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>JustiConsulta</Text>
          <Text style={styles.subtitle}>Inicia Sesión</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="correo@ejemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="••••••••"
                  secureTextEntry
                  autoCapitalize="none"
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </View>

          {/* API Error */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          {/* Links */}
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('RecoveryPassword')}>
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#003366',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linksContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: '#003366',
    fontSize: 14,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
