import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  sendWelcomeNotification,
  sendNewActuationNotification,
  sendProcessDeletedNotification,
  sendReminderNotification,
} from '../../../services/NotificationsAPI';

const NotificationSimulatorModal = ({ visible, onClose, onSuccess, user }) => {
  const [notificationType, setNotificationType] = useState('welcome');
  const [loading, setLoading] = useState(false);
  
  // Campos del formulario
  const [userDocumentNumber, setUserDocumentNumber] = useState(user?.documentNumber || '');
  const [numeroRadicacion, setNumeroRadicacion] = useState('');
  const [actuacion, setActuacion] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [cantidadProcesos, setCantidadProcesos] = useState('5');

  const notificationTypes = [
    { value: 'welcome', label: 'Bienvenida', icon: 'mail' },
    { value: 'new-actuation', label: 'Nueva Actuación', icon: 'newspaper' },
    { value: 'process-deleted', label: 'Proceso Eliminado', icon: 'trash' },
    { value: 'reminder', label: 'Recordatorio', icon: 'time' },
  ];

  const resetForm = () => {
    setUserDocumentNumber(user?.documentNumber || '');
    setNumeroRadicacion('');
    setActuacion('');
    setFecha(new Date().toISOString().split('T')[0]);
    setCantidadProcesos('5');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!userDocumentNumber.trim()) {
      Alert.alert('Error', 'El número de documento es obligatorio');
      return;
    }

    setLoading(true);

    try {
      let result;

      switch (notificationType) {
        case 'welcome':
          result = await sendWelcomeNotification(userDocumentNumber);
          break;
        case 'new-actuation':
          if (!numeroRadicacion.trim() || !actuacion.trim() || !fecha) {
            Alert.alert('Error', 'Completa todos los campos requeridos');
            setLoading(false);
            return;
          }
          result = await sendNewActuationNotification({
            userDocumentNumber,
            numeroRadicacion,
            actuacion,
            fecha,
          });
          break;
        case 'process-deleted':
          if (!numeroRadicacion.trim()) {
            Alert.alert('Error', 'El número de radicación es obligatorio');
            setLoading(false);
            return;
          }
          result = await sendProcessDeletedNotification({
            userDocumentNumber,
            numeroRadicacion,
          });
          break;
        case 'reminder':
          result = await sendReminderNotification({
            userDocumentNumber,
            cantidadProcesos: parseInt(cantidadProcesos) || 5,
          });
          break;
        default:
          throw new Error('Tipo de notificación no válido');
      }

      Alert.alert(
        'Notificación Enviada',
        '✓ La notificación ha sido enviada por correo electrónico',
        [
          {
            text: 'Aceptar',
            onPress: () => {
              if (onSuccess) onSuccess(result);
              handleClose();
            },
          },
        ]
      );
    } catch (err) {
      console.error('Error enviando notificación:', err);
      Alert.alert(
        'Error',
        err.response?.data?.message || err.message || 'No se pudo enviar la notificación'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Simular Notificación por Email</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
            {/* Selector de tipo */}
            <Text style={styles.subtitle}>Selecciona el tipo de notificación:</Text>
            <View style={styles.typesContainer}>
              {notificationTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    notificationType === type.value && styles.typeButtonActive,
                  ]}
                  onPress={() => setNotificationType(type.value)}
                >
                  <Ionicons
                    name={type.icon}
                    size={20}
                    color={notificationType === type.value ? '#FFF' : '#D97706'}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      notificationType === type.value && styles.typeButtonTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Campos del formulario */}
            <View style={styles.formContainer}>
              <Text style={styles.formLabel}>
                Número de Documento <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={userDocumentNumber}
                onChangeText={setUserDocumentNumber}
                placeholder="Ej: 123456789"
                keyboardType="numeric"
              />

              {(notificationType === 'new-actuation' || notificationType === 'process-deleted') && (
                <>
                  <Text style={styles.formLabel}>
                    Número de Radicación <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={numeroRadicacion}
                    onChangeText={setNumeroRadicacion}
                    placeholder="Ej: 50001333100120070007600"
                    keyboardType="numeric"
                  />
                </>
              )}

              {notificationType === 'new-actuation' && (
                <>
                  <Text style={styles.formLabel}>
                    Descripción de la Actuación <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={actuacion}
                    onChangeText={setActuacion}
                    placeholder="Describa la actuación judicial..."
                    multiline
                    numberOfLines={3}
                  />

                  <Text style={styles.formLabel}>
                    Fecha <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={fecha}
                    onChangeText={setFecha}
                    placeholder="YYYY-MM-DD"
                  />
                </>
              )}

              {notificationType === 'reminder' && (
                <>
                  <Text style={styles.formLabel}>Cantidad de Procesos</Text>
                  <TextInput
                    style={styles.input}
                    value={cantidadProcesos}
                    onChangeText={setCantidadProcesos}
                    placeholder="5"
                    keyboardType="numeric"
                  />
                </>
              )}
            </View>

            {/* Nota informativa */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#0EA5E9" />
              <Text style={styles.infoText}>
                La notificación será enviada al correo electrónico asociado con el número de documento ingresado.
              </Text>
            </View>
          </ScrollView>

          {/* Botones */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color="#FFF" />
                  <Text style={styles.submitButtonText}>Enviando...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="mail" size={18} color="#FFF" />
                  <Text style={styles.submitButtonText}>Enviar Email</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#D97706',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D97706',
  },
  typeButtonTextActive: {
    color: '#FFF',
  },
  formContainer: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 12,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    gap: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#0369A1',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#D97706',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default NotificationSimulatorModal;
