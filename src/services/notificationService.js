import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Solicitar permisos de notificación (solo notificaciones locales)
export const solicitarPermisos = async () => {
  // En Expo Go, las notificaciones locales funcionan sin problemas
  if (!Device.isDevice) {
    // En simulador/emulador, las notificaciones locales pueden no funcionar
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      // Permisos denegados - no crítico para notificaciones locales
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6B00',
        sound: 'default',
      });
    }

    return true;
  } catch (error) {
    // Si hay error, no es crítico para el funcionamiento de la app
    console.warn('⚠️ Error al solicitar permisos de notificación (no crítico):', error.message);
    return false;
  }
};

// Obtener el token de notificación (SOLO para Development Build o Producción)
// ⚠️ Esta función NO funciona en Expo Go (removido desde SDK 53)
// Las notificaciones LOCALES sí funcionan en Expo Go
export const obtenerTokenNotificacion = async () => {
  if (__DEV__) {
    console.warn('⚠️ Push tokens no están disponibles en Expo Go. Usa notificaciones locales o crea un Development Build.');
    return null;
  }
  
  try {
    const hasPermission = await solicitarPermisos();
    if (!hasPermission) return null;

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'polleria-e775d',
    });
    
    return token?.data || null;
  } catch (error) {
    console.error('Error al obtener token de notificación:', error);
    return null;
  }
};

// Enviar notificación local con sonido
export const enviarNotificacionLocal = async (titulo, cuerpo, datos = {}) => {
  try {
    // Asegurar que los datos sean serializables
    const datosSerializados = {};
    if (datos && typeof datos === 'object' && !Array.isArray(datos)) {
      try {
        Object.keys(datos).forEach(key => {
          const valor = datos[key];
          if (valor !== null && valor !== undefined) {
            // Convertir a string si es necesario
            if (typeof valor === 'object') {
              try {
                datosSerializados[key] = JSON.stringify(valor);
              } catch {
                datosSerializados[key] = String(valor);
              }
            } else {
              datosSerializados[key] = String(valor);
            }
          }
        });
      } catch (e) {
        console.warn('Error al serializar datos de notificación:', e);
      }
    }

    const notificationContent = {
      title: String(titulo || 'Notificación'),
      body: String(cuerpo || ''),
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    };

    // Solo agregar data si hay datos serializados
    if (Object.keys(datosSerializados).length > 0) {
      notificationContent.data = datosSerializados;
    }

    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: null, // Inmediata
    });
  } catch (error) {
    console.error('Error al enviar notificación local:', error);
    // No re-lanzar el error para que no rompa el flujo
  }
};

// Configurar listener de notificaciones
export const configurarListenerNotificaciones = (callback) => {
  const subscription = Notifications.addNotificationReceivedListener(notification => {
    callback(notification);
  });

  return subscription;
};

// Configurar listener de interacción con notificaciones
export const configurarListenerInteraccion = (callback) => {
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    callback(response);
  });

  return subscription;
};

// Cancelar todas las notificaciones
export const cancelarTodasNotificaciones = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

