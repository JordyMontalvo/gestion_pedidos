import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Firebase
// ✅ Credenciales extraídas de google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyD2VyD0jq8JskpGM6-8y-95YTVuAy4JdI4",
  authDomain: "polleria-e775d.firebaseapp.com",
  projectId: "polleria-e775d",
  storageBucket: "polleria-e775d.firebasestorage.app",
  messagingSenderId: "964762330302",
  appId: "1:964762330302:android:a11a4deccfaf05aaab6aef"
};

// Inicializar Firebase
let app;
let db;
let auth;

try {
  app = initializeApp(firebaseConfig);
  // Configurar Firestore para React Native
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // Necesario para React Native
  });
  // Configurar Auth con persistencia usando AsyncStorage
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  console.error('Error al inicializar Firebase:', error);
}

export { db, auth, app };
export default { db, auth, app };

