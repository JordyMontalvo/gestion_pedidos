// Script de prueba para verificar la conexión con Firebase
// Puedes importar esto y llamarlo desde la app

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

export const testFirebaseConnection = async () => {
  try {
    console.log('🧪 Probando conexión con Firebase...');
    
    // Intentar leer la colección de productos
    const productosRef = collection(db, 'productos');
    const snapshot = await getDocs(productosRef);
    
    console.log('✅ Conexión exitosa con Firestore!');
    console.log(`📊 Productos encontrados: ${snapshot.size}`);
    
    if (snapshot.size > 0) {
      console.log('📦 Primeros productos:', snapshot.docs.slice(0, 3).map(doc => doc.data().nombre));
    }
    
    return { success: true, count: snapshot.size };
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    console.error('🔍 Verifica:');
    console.error('  1. Las credenciales en src/services/firebase.js');
    console.error('  2. Las reglas de seguridad en Firebase Console');
    console.error('  3. Que Firestore Database esté creado');
    return { success: false, error: error.message };
  }
};

