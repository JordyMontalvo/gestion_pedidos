import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, ROLES, NOMBRES_ROLES } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { iniciarSesion } = useAuth();
  const [nombreUsuario, setNombreUsuario] = useState('');

  const rolesDisponibles = [
    { id: ROLES.MESERO, nombre: NOMBRES_ROLES.mesero, icon: 'restaurant', color: '#4CAF50' },
    { id: ROLES.COCINA, nombre: NOMBRES_ROLES.cocina, icon: 'fast-food', color: '#FF9800' },
    { id: ROLES.CAJA, nombre: NOMBRES_ROLES.caja, icon: 'cash', color: '#2196F3' },
    { id: ROLES.ADMIN, nombre: NOMBRES_ROLES.admin, icon: 'settings', color: '#9C27B0' },
  ];

  const handleSeleccionarRol = async (rol) => {
    try {
      const exito = await iniciarSesion(rol, nombreUsuario.trim() || null);
      if (exito) {
        // La navegación se manejará automáticamente cuando cambie el rol
      } else {
        Alert.alert('Error', 'No se pudo iniciar sesión. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al seleccionar rol:', error);
      Alert.alert('Error', 'Hubo un problema al iniciar sesión.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🍗 Pollería</Text>
        <Text style={styles.subtitle}>Selecciona tu rol</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tu nombre (opcional):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Juan, María..."
            value={nombreUsuario}
            onChangeText={setNombreUsuario}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.rolesContainer}>
          {rolesDisponibles.map((rol) => (
            <TouchableOpacity
              key={rol.id}
              style={[styles.rolButton, { borderLeftColor: rol.color }]}
              onPress={() => handleSeleccionarRol(rol.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.rolIconContainer, { backgroundColor: rol.color + '20' }]}>
                <Ionicons name={rol.icon} size={32} color={rol.color} />
              </View>
              <View style={styles.rolInfo}>
                <Text style={styles.rolNombre}>{rol.nombre}</Text>
                <Text style={styles.rolDescripcion}>
                  {rol.id === ROLES.MESERO && 'Atiende mesas y toma pedidos'}
                  {rol.id === ROLES.COCINA && 'Prepara los pedidos'}
                  {rol.id === ROLES.CAJA && 'Cobra los pedidos'}
                  {rol.id === ROLES.ADMIN && 'Administra todo el sistema'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#FF6B00',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rolesContainer: {
    gap: 15,
  },
  rolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rolIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rolInfo: {
    flex: 1,
  },
  rolNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  rolDescripcion: {
    fontSize: 14,
    color: '#666',
  },
});

export default LoginScreen;

