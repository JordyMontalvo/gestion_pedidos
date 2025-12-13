# 🔒 Reglas de Seguridad Firestore

## ⚠️ IMPORTANTE: Configurar las Reglas

Ve a: https://console.firebase.google.com/project/polleria-e775d/firestore/rules

Y reemplaza las reglas actuales con estas:

---

## 📋 Reglas Recomendadas (Para Empezar)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Productos: lectura y escritura públicas (por ahora)
    match /productos/{productoId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Pedidos: lectura y escritura públicas (por ahora)
    match /pedidos/{pedidoId} {
      allow read: if true;
      allow write: if true;
      
      // Items del pedido (subcolección)
      match /items/{itemId} {
        allow read: if true;
        allow write: if true;
      }
    }
  }
}
```

**⚠️ IMPORTANTE**: Estas reglas permiten acceso público. Para producción, implementa autenticación.

---

## 🔒 Reglas Más Seguras (Con Autenticación - Futuro)

Si más adelante quieres agregar autenticación:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer productos
    match /productos/{productoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Solo usuarios autenticados pueden ver y crear pedidos
    match /pedidos/{pedidoId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && request.auth.token.admin == true;
      
      match /items/{itemId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

---

## 📝 Cómo Aplicar las Reglas

1. Ve a: https://console.firebase.google.com/project/polleria-e775d/firestore/rules
2. Copia las reglas de arriba (versión simple para empezar)
3. Pega en el editor
4. Haz clic en "Publicar"
5. Espera unos segundos para que se propaguen

---

## ⚠️ Error Común

Si ves este error:
```
Missing or insufficient permissions
```

**Causa**: Las reglas están bloqueando el acceso (probablemente tienes `if false`)

**Solución**: Usa las reglas de arriba que permiten acceso público temporalmente.

---

¡Configura las reglas y la conexión funcionará! 🔓


