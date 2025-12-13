# 📦 Almacenamiento de Datos

## Ubicación de los Datos

### 1. **Pedidos** ✅ (Persistente)
- **Tecnología**: AsyncStorage
- **Clave de almacenamiento**: `'pedidos'`
- **Ubicación física en Android**:
  - `/data/data/com.polleria.gestionpedidos/files/RKStorage/pedidos`
  - O en el almacenamiento interno de la app
- **Formato**: JSON stringificado
- **Persistencia**: ✅ Los datos se mantienen aunque cierres la app

### 2. **Carrito** ❌ (Temporal - Solo en memoria)
- **Tecnología**: React useState (memoria RAM)
- **Persistencia**: ❌ Se pierde al cerrar la app
- **Nota**: El carrito se limpia automáticamente cuando se crea un pedido

### 3. **Productos** 📝 (Hardcodeados)
- **Tecnología**: Array estático en el código
- **Ubicación**: `src/context/PedidosContext.js` (líneas 17-100)
- **Persistencia**: ✅ Siempre disponibles (están en el código)

---

## Cómo Funciona AsyncStorage

AsyncStorage es una API de React Native que almacena datos de forma asíncrona en el dispositivo. Es similar a `localStorage` en navegadores web.

### Características:
- ✅ **Persistente**: Los datos se mantienen entre sesiones
- ✅ **Local**: Se almacena en el dispositivo, no en la nube
- ✅ **Asíncrono**: No bloquea la UI al guardar/cargar
- ⚠️ **Límite**: ~6MB de almacenamiento (suficiente para miles de pedidos)

---

## Flujo de Almacenamiento

### Al crear un pedido:
1. Se crea el objeto pedido en memoria
2. Se agrega a la lista de pedidos
3. Se guarda automáticamente en AsyncStorage
4. El carrito se limpia

### Al iniciar la app:
1. Se carga automáticamente desde AsyncStorage
2. Los pedidos aparecen en la pantalla de Pedidos

### Al actualizar/eliminar un pedido:
1. Se actualiza en memoria
2. Se guarda inmediatamente en AsyncStorage

---

## Código Relevante

```javascript
// Guardar pedidos
const guardarPedidos = async (nuevosPedidos) => {
  await AsyncStorage.setItem('pedidos', JSON.stringify(nuevosPedidos));
};

// Cargar pedidos
const cargarPedidos = async () => {
  const pedidosGuardados = await AsyncStorage.getItem('pedidos');
  if (pedidosGuardados) {
    setPedidos(JSON.parse(pedidosGuardados));
  }
};
```

---

## Acceso a los Datos (Solo para desarrollo)

### En Android (con dispositivo rooteado o emulador):
```bash
# Conectar al dispositivo
adb shell

# Navegar a la carpeta de la app
cd /data/data/com.polleria.gestionpedidos/files/RKStorage

# Ver el archivo
cat pedidos
```

### Con Expo:
Los datos están en el almacenamiento interno de la app, no son accesibles directamente sin herramientas especiales.

---

## Mejoras Futuras Sugeridas

1. **Guardar el carrito** para que no se pierda al cerrar la app
2. **Backup en la nube** (Firebase, AWS, etc.)
3. **Exportar pedidos** a CSV/PDF
4. **Sincronización** entre dispositivos
5. **Base de datos local** (SQLite) para mejor rendimiento con muchos datos

---

## Notas Importantes

⚠️ **Los datos son locales**: Si desinstalas la app, se pierden todos los pedidos.

⚠️ **Sin sincronización**: Los datos no se sincronizan entre dispositivos automáticamente.

✅ **Privacidad**: Todos los datos están en el dispositivo, no se envían a servidores externos.


