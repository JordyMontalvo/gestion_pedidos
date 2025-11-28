import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Roles disponibles
export const ROLES = {
  MESERO: 'mesero',
  COCINA: 'cocina',
  CAJA: 'caja',
  ADMIN: 'admin',
};

// Nombres de roles para mostrar
export const NOMBRES_ROLES = {
  mesero: '👨‍💼 Mesero',
  cocina: '👨‍🍳 Cocina',
  caja: '💰 Caja',
  admin: '⚙️ Admin',
};

export const AuthProvider = ({ children }) => {
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Cargar rol guardado al iniciar
  useEffect(() => {
    cargarRolGuardado();
  }, []);

  const cargarRolGuardado = async () => {
    try {
      const rolGuardado = await AsyncStorage.getItem('usuario_rol');
      if (rolGuardado) {
        setRol(rolGuardado);
      }
      setCargando(false);
    } catch (error) {
      console.error('Error al cargar rol:', error);
      setCargando(false);
    }
  };

  // Iniciar sesión con rol (solo guardar localmente)
  const iniciarSesion = async (rolSeleccionado, nombreUsuario = '') => {
    try {
      // Guardar rol en AsyncStorage
      await AsyncStorage.setItem('usuario_rol', rolSeleccionado);
      if (nombreUsuario) {
        await AsyncStorage.setItem('usuario_nombre', nombreUsuario);
      }
      
      setRol(rolSeleccionado);
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  };

  // Cerrar sesión
  const cerrarSesion = async () => {
    try {
      console.log('🔴 Iniciando cierre de sesión...');
      await AsyncStorage.removeItem('usuario_rol');
      await AsyncStorage.removeItem('usuario_nombre');
      // Actualizar estado inmediatamente - esto debería hacer que AppContent muestre LoginScreen
      setRol(null);
      console.log('✅ Sesión cerrada correctamente, rol establecido en null');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      throw error; // Re-lanzar para que el Alert pueda manejarlo
    }
  };

  // Obtener nombre del usuario guardado
  const obtenerNombreUsuario = async () => {
    try {
      return await AsyncStorage.getItem('usuario_nombre') || '';
    } catch (error) {
      return '';
    }
  };

  // Verificar si tiene permiso
  const tienePermiso = (rolRequerido) => {
    if (!rol) return false;
    
    // Admin tiene todos los permisos
    if (rol === ROLES.ADMIN) return true;
    
    // Verificar rol específico
    return rol === rolRequerido;
  };

  const value = {
    rol,
    cargando,
    iniciarSesion,
    cerrarSesion,
    obtenerNombreUsuario,
    tienePermiso,
    esMesero: rol === ROLES.MESERO,
    esCocina: rol === ROLES.COCINA,
    esCaja: rol === ROLES.CAJA,
    esAdmin: rol === ROLES.ADMIN,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
