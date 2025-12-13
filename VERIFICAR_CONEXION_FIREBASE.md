# ✅ Verificar Conexión con Firebase Firestore

## 🎯 IMPORTANTE: Expo vs Android Nativo

**Estamos usando Expo/React Native**, NO Android nativo con Kotlin/Java.

Por lo tanto:
- ❌ NO necesitamos configurar `build.gradle`
- ❌ NO necesitamos código Kotlin/Java
- ✅ YA está todo configurado con el SDK de Firebase para JavaScript

---

## ✅ Verificación de la Conexión

### 1. Verificar Credenciales

Abre `src/services/firebase.js` y verifica que tenga tus credenciales:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD2VyD0jq8JskpGM6-8y-95YTVuAy4JdI4",
  authDomain: "polleria-e775d.firebaseapp.com",
  projectId: "polleria-e775d",
  // ...
};
```

### 2. Verificar Reglas de Seguridad

⚠️ **MUY IMPORTANTE**: Las reglas de seguridad deben permitir lectura/escritura.

Ve a: https://console.firebase.google.com/project/polleria-e775d/firestore/rules

Y asegúrate de tener estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /productos/{productoId} {
      allow read: if true;
      allow write: if true;
    }
    
    match /pedidos/{pedidoId} {
      allow read: if true;
      allow write: if true;
      
      match /items/{itemId} {
        allow read: if true;
        allow write: if true;
      }
    }
  }
}
```

**Si tienes `allow read, write: if false;` la conexión NO funcionará.**

### 3. Crear Firestore Database (si aún no lo hiciste)

1. Ve a: https://console.firebase.google.com/project/polleria-e775d/firestore
2. Haz clic en "Crear base de datos"
3. Selecciona "Modo de producción"
4. Elige ubicación (ej: `southamerica-east1`)
5. Haz clic en "Habilitar"

---

## 🧪 Probar la Conexión

### Opción 1: Desde la App

1. **Ejecuta la app:**
   ```bash
   npm start
   ```

2. **Ve a la pantalla Admin** (nueva pestaña)

3. **Intenta crear un pedido** desde la app

4. **Verifica en Firebase Console:**
   - Ve a: https://console.firebase.google.com/project/polleria-e775d/firestore/data
   - Deberías ver las colecciones `productos` y `pedidos`
   - Los datos aparecen en tiempo real

### Opción 2: Revisar Logs

Abre la consola de Expo y busca:
- ✅ `"✅ Conectado a Firestore - Base de datos compartida"` = Conexión exitosa
- ❌ `"❌ Error al inicializar datos de Firestore"` = Problema de conexión

---

## 🔍 Solución de Problemas

### Error: "Missing or insufficient permissions"

**Causa**: Las reglas de seguridad están bloqueando el acceso.

**Solución**: 
1. Ve a Firestore Rules
2. Cambia a las reglas que mostré arriba
3. Haz clic en "Publicar"

### Error: "Firebase: Error (auth/api-key-not-valid)"

**Causa**: La API Key no es correcta.

**Solución**: 
1. Verifica `google-services.json`
2. Asegúrate de que `firebase.js` tenga la API Key correcta

### No aparecen datos en Firebase Console

**Posibles causas**:
1. Las reglas están bloqueando escritura
2. La base de datos no está creada
3. Error de conexión

**Solución**: 
1. Revisa las reglas de seguridad
2. Crea la base de datos Firestore
3. Revisa los logs en la consola

---

## 📝 Ejemplo de Uso (Ya Implementado)

El código ya está implementado en `firestoreService.js`. Aquí algunos ejemplos:

### Crear un Pedido:
```javascript
import { crearPedido } from '../services/firestoreService';

const nuevoPedido = {
  fecha: new Date().toISOString(),
  clienteNombre: 'Juan Pérez',
  estado: 'pendiente',
  total: 45.50,
  items: [
    { id: 1, nombre: 'Pollo Entero', precio: 25.00, cantidad: 1 }
  ]
};

const pedidoCreado = await crearPedido(nuevoPedido);
```

### Escuchar Cambios en Tiempo Real:
```javascript
import { suscribirPedidos } from '../services/firestoreService';

const unsubscribe = suscribirPedidos((pedidos) => {
  console.log('Pedidos actualizados:', pedidos);
  // Los pedidos se actualizan automáticamente cuando cambian
});
```

Ya está implementado en `PedidosContext.js`.

---

## ✅ Checklist de Verificación

- [ ] Firebase configurado con credenciales correctas
- [ ] Firestore Database creado en Firebase Console
- [ ] Reglas de seguridad configuradas (permiten read/write)
- [ ] App ejecutándose (`npm start`)
- [ ] Logs muestran "✅ Conectado a Firestore"
- [ ] Puedes crear pedidos desde la app
- [ ] Los datos aparecen en Firebase Console

---

## 🎯 Estado Actual

✅ **Firebase configurado** - Credenciales correctas
✅ **Firestore Service creado** - Funciones CRUD listas
✅ **Context actualizado** - Usa Firestore
⏳ **Firestore Database** - Crea si no existe
⏳ **Reglas de seguridad** - Configúralas para permitir acceso

---

¡Verifica estos puntos y la conexión debería funcionar! 🎉


