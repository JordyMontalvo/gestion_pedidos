# 🔄 Firestore vs SQLite - Comparación

## 📊 Cambio de SQLite Local a Firestore Compartido

### ✅ **Implementado: Firestore (Base de Datos Compartida)**

La aplicación ahora usa **Firebase Firestore** para que todos los usuarios compartan la misma base de datos.

---

## 🔄 Cómo Cambiar entre SQLite y Firestore

### Usar Firestore (Actual - Base de datos compartida):
El código ya está configurado para usar Firestore. Solo necesitas:
1. Configurar las credenciales de Firebase (ver `CONFIGURAR_FIREBASE.md`)
2. La app usará Firestore automáticamente

### Volver a SQLite (Base de datos local):
Si necesitas volver a SQLite local:

1. En `src/context/PedidosContext.js`, cambia las importaciones:
```javascript
// Cambiar de:
import { ... } from '../services/firestoreService';

// A:
import { ... } from '../services/database';
```

2. Actualiza la inicialización para incluir `initDatabase()`

---

## 📋 Diferencias Principales

### SQLite (Local)
- ✅ Funciona sin internet
- ✅ Más rápido (local)
- ❌ No se sincroniza entre dispositivos
- ❌ Cada usuario tiene su propia base de datos

### Firestore (Compartido)
- ✅ Todos los usuarios ven los mismos datos
- ✅ Sincronización en tiempo real
- ✅ Backup automático en la nube
- ✅ Acceso desde cualquier dispositivo
- ❌ Requiere conexión a internet
- ❌ Puede tener costos (plan gratuito generoso)

---

## 🎯 Para tu Caso de Uso (Pollería)

**Firestore es la mejor opción** porque:
- ✅ Todos los empleados ven los mismos pedidos
- ✅ Actualizaciones en tiempo real (cuando cambia un estado)
- ✅ No necesitas servidor propio
- ✅ Escalable automáticamente
- ✅ Plan gratuito suficiente para empezar

---

## ⚙️ Configuración Actual

**Estado**: ✅ Configurado para Firestore

**Para activar**:
1. Configura Firebase (ver `CONFIGURAR_FIREBASE.md`)
2. Agrega las credenciales en `src/services/firebase.js`
3. ¡Listo! Todos compartirán la misma base de datos

