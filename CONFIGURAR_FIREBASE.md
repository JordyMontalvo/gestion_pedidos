# 🔥 Configurar Firebase para Base de Datos Compartida

## 🎯 Objetivo

Configurar Firebase Firestore para que todos los usuarios accedan a la misma base de datos compartida en tiempo real.

---

## 📋 Paso 1: Crear Proyecto en Firebase

### 1. Ir a Firebase Console
- Ve a: https://console.firebase.google.com/
- Inicia sesión con tu cuenta de Google

### 2. Crear un Nuevo Proyecto
- Haz clic en "Agregar proyecto"
- Nombre del proyecto: `gestion-pedidos-polleria` (o el que prefieras)
- Desactiva Google Analytics (opcional, puedes activarlo después)
- Haz clic en "Crear proyecto"

### 3. Agregar una App Android
- Haz clic en el ícono de Android
- **Nombre del paquete Android**: `com.polleria.gestionpedidos`
- **Apodo de la app**: `Gestión Pedidos Pollería`
- Haz clic en "Registrar app"

### 4. Descargar el archivo de configuración
- **NO necesitas descargar** el `google-services.json` para Expo
- Anota los valores de configuración que aparecen

---

## 🔧 Paso 2: Configurar Firestore Database

### 1. Crear Base de Datos Firestore
- En el menú lateral, ve a **Firestore Database**
- Haz clic en "Crear base de datos"
- Selecciona **Modo de producción** (puedes cambiarlo después)
- Selecciona una ubicación cercana (ej: `southamerica-east1` para Perú)
- Haz clic en "Habilitar"

### 2. Configurar Reglas de Seguridad

Ve a la pestaña **Reglas** y copia estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Productos: lectura pública, escritura restringida (puedes cambiar esto)
    match /productos/{productoId} {
      allow read: if true;
      allow write: if true; // En producción, deberías restringir esto
    }
    
    // Pedidos: lectura pública, escritura pública (puedes cambiar esto)
    match /pedidos/{pedidoId} {
      allow read: if true;
      allow write: if true; // En producción, deberías restringir esto
      
      // Items del pedido
      match /items/{itemId} {
        allow read: if true;
        allow write: if true;
      }
    }
  }
}
```

**⚠️ IMPORTANTE**: Estas reglas permiten lectura y escritura pública. Para producción, deberías implementar autenticación.

### 3. Configurar Índices

Firebase te pedirá crear índices automáticamente cuando los necesites. Acepta cuando aparezca el mensaje.

---

## ⚙️ Paso 3: Obtener Credenciales de Firebase

### 1. Ir a Configuración del Proyecto
- Ve a ⚙️ (Configuración) → Configuración del proyecto
- Baja hasta "Tus aplicaciones"
- Haz clic en la app Android que creaste

### 2. Copiar los Valores de Configuración
Verás algo como esto:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:android:abcdef..."
};
```

---

## 🔑 Paso 4: Configurar en tu Proyecto

### 1. Editar `src/services/firebase.js`

Abre el archivo y reemplaza los valores:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

---

## 📱 Paso 5: Actualizar PedidosContext

El contexto ya está configurado para usar Firestore. Solo necesitas:

1. Asegurarte de que `firebase.js` tenga las credenciales correctas
2. La app usará Firestore automáticamente

---

## ✅ Verificar que Funciona

### 1. Reiniciar la App
```bash
npm start
```

### 2. Probar Crear un Producto o Pedido
- Crea un pedido desde la app
- Debería aparecer en Firebase Console → Firestore Database

### 3. Ver Datos en Tiempo Real
- Abre Firebase Console en tu navegador
- Ve a Firestore Database
- Deberías ver las colecciones `productos` y `pedidos`
- Los cambios se sincronizan en tiempo real

---

## 🔄 Migración desde SQLite a Firestore

Si ya tienes datos en SQLite, puedes crear un script de migración:

1. Exportar datos de SQLite (desde la pantalla Admin)
2. Importar manualmente a Firestore
3. O crear un script de migración automático

---

## 💰 Costos de Firebase

### Plan Gratuito (Spark):
- ✅ 1 GB de almacenamiento
- ✅ 10 GB/mes de transferencia
- ✅ 20,000 lecturas/día
- ✅ 20,000 escrituras/día
- ✅ 20,000 eliminaciones/día

**Suficiente para empezar y para la mayoría de pollerías pequeñas/medianas**

### Plan Pago (Blaze - Pay as you go):
- 💰 $0.06 por GB de almacenamiento
- 💰 $0.06 por 100,000 lecturas
- 💰 $0.18 por 100,000 escrituras
- 💰 $0.02 por 100,000 eliminaciones

---

## 🔒 Seguridad en Producción

### Implementar Autenticación (Recomendado):

```javascript
// En firestoreService.js, cambiar las reglas a:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /productos/{productoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /pedidos/{pedidoId} {
      allow read, write: if request.auth != null;
      match /items/{itemId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

---

## 📊 Ventajas de Firestore vs SQLite Local

| Característica | SQLite Local | Firestore |
|----------------|--------------|-----------|
| **Sincronización** | ❌ No | ✅ Tiempo real |
| **Acceso compartido** | ❌ No | ✅ Sí |
| **Backup automático** | ❌ No | ✅ Sí |
| **Escalabilidad** | ❌ Limitada | ✅ Ilimitada |
| **Funciona sin internet** | ✅ Sí | ⚠️ Con caché |
| **Costo** | ✅ Gratis | 💰 Gratis hasta cierto límite |

---

## 🚀 Próximos Pasos

1. **Crear proyecto en Firebase** ✅
2. **Configurar Firestore** ✅
3. **Copiar credenciales a `firebase.js`** ✅
4. **Probar la app** ✅
5. **Configurar reglas de seguridad** (opcional pero recomendado)

---

## 📞 Soporte

Si tienes problemas:
- Verifica que las credenciales estén correctas
- Revisa las reglas de Firestore
- Verifica la consola de Firebase para errores
- Revisa los logs de la app

---

¡Una vez configurado, todos los usuarios compartirán la misma base de datos en tiempo real! 🎉

