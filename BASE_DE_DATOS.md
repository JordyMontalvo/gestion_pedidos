# 🗄️ Base de Datos SQLite

## Implementación Completada ✅

La aplicación ahora utiliza **SQLite** como base de datos local para almacenar productos y pedidos de forma persistente y estructurada.

---

## 📊 Estructura de la Base de Datos

### Tabla: `productos`
Almacena el catálogo de productos disponibles.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER | Clave primaria (auto-incremental) |
| `nombre` | TEXT | Nombre del producto |
| `precio` | REAL | Precio del producto |
| `categoria` | TEXT | Categoría (pollo, combo, extras, bebidas) |
| `imagen` | TEXT | Emoji o imagen del producto |
| `descripcion` | TEXT | Descripción opcional |
| `disponible` | INTEGER | 1 = disponible, 0 = no disponible |
| `created_at` | DATETIME | Fecha de creación |
| `updated_at` | DATETIME | Fecha de última actualización |

### Tabla: `pedidos`
Almacena los pedidos realizados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER | Clave primaria (auto-incremental) |
| `fecha` | DATETIME | Fecha y hora del pedido |
| `clienteNombre` | TEXT | Nombre del cliente (opcional) |
| `observaciones` | TEXT | Observaciones del pedido |
| `estado` | TEXT | Estado: pendiente, en_preparacion, listo, entregado |
| `total` | REAL | Total del pedido |
| `created_at` | DATETIME | Fecha de creación |
| `updated_at` | DATETIME | Fecha de última actualización |

### Tabla: `pedido_items`
Almacena los items de cada pedido (relación muchos a muchos).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER | Clave primaria (auto-incremental) |
| `pedidoId` | INTEGER | ID del pedido (foreign key) |
| `productoId` | INTEGER | ID del producto (foreign key) |
| `cantidad` | INTEGER | Cantidad del producto |
| `precio` | REAL | Precio al momento del pedido |
| `nombre` | TEXT | Nombre del producto (snapshot) |
| `imagen` | TEXT | Imagen del producto (snapshot) |
| `created_at` | DATETIME | Fecha de creación |

---

## 🔧 Funciones Disponibles

### Productos
- `obtenerProductos()` - Obtener todos los productos
- `obtenerProductoPorId(id)` - Obtener un producto específico
- `crearProducto(producto)` - Crear un nuevo producto
- `actualizarProducto(id, producto)` - Actualizar un producto
- `eliminarProducto(id)` - Eliminar un producto

### Pedidos
- `obtenerPedidos()` - Obtener todos los pedidos con sus items
- `obtenerPedidoPorId(id)` - Obtener un pedido específico con sus items
- `crearPedido(pedido)` - Crear un nuevo pedido con items
- `actualizarEstadoPedido(id, estado)` - Actualizar el estado de un pedido
- `eliminarPedido(id)` - Eliminar un pedido (y sus items por CASCADE)

### Utilidades
- `inicializarProductosPorDefecto()` - Insertar productos iniciales si la tabla está vacía
- `obtenerEstadisticas()` - Obtener estadísticas de pedidos

---

## 📍 Ubicación de la Base de Datos

### En Android:
```
/data/data/com.polleria.gestionpedidos/databases/pedidos_polleria.db
```

### Características:
- ✅ **Local**: Se almacena en el dispositivo
- ✅ **Persistente**: Los datos se mantienen entre sesiones
- ✅ **Transaccional**: Operaciones atómicas (todo o nada)
- ✅ **Relacional**: Relaciones entre tablas con foreign keys
- ✅ **Índices**: Optimizado para búsquedas rápidas

---

## 🚀 Ventajas sobre AsyncStorage

| Característica | AsyncStorage | SQLite |
|----------------|--------------|--------|
| **Estructura** | JSON plano | Tablas relacionales |
| **Búsquedas** | Lenta (carga todo) | Rápida (consultas SQL) |
| **Escalabilidad** | Limitada | Excelente |
| **Relaciones** | Manual | Automáticas (FK) |
| **Transacciones** | No | Sí |
| **Consultas complejas** | No | Sí (SQL) |
| **Límite de tamaño** | ~6MB | Ilimitado (prácticamente) |

---

## 📝 Ejemplo de Uso

```javascript
import { obtenerPedidos, crearPedido } from '../services/database';

// Obtener todos los pedidos
const pedidos = await obtenerPedidos();

// Crear un nuevo pedido
const nuevoPedido = {
  fecha: new Date().toISOString(),
  clienteNombre: 'Juan Pérez',
  observaciones: 'Sin cebolla',
  estado: 'pendiente',
  total: 45.50,
  items: [
    { id: 1, nombre: 'Pollo Entero', precio: 25.00, cantidad: 1, imagen: '🍗' },
    { id: 6, nombre: 'Papas Fritas', precio: 5.00, cantidad: 2, imagen: '🍟' }
  ]
};

const pedidoCreado = await crearPedido(nuevoPedido);
```

---

## 🔄 Migración desde AsyncStorage

La aplicación ahora usa SQLite en lugar de AsyncStorage:

- ✅ **Productos**: Se cargan desde la base de datos
- ✅ **Pedidos**: Se guardan y cargan desde la base de datos
- ✅ **Inicialización automática**: Los productos por defecto se insertan si no existen

---

## 🛠️ Mantenimiento

### Ver la base de datos (desarrollo):
```bash
# Conectar al dispositivo
adb shell

# Navegar a la carpeta
cd /data/data/com.polleria.gestionpedidos/databases

# Ver el archivo
ls -la pedidos_polleria.db
```

### Backup:
La base de datos se puede respaldar copiando el archivo `.db` desde el dispositivo.

---

## 📈 Próximas Mejoras Sugeridas

1. **Migraciones de esquema** para actualizaciones futuras
2. **Backup automático** a la nube
3. **Sincronización** entre dispositivos
4. **Consultas avanzadas** (reportes, estadísticas)
5. **Índices adicionales** para optimización

---

## ⚠️ Notas Importantes

- La base de datos se crea automáticamente al iniciar la app
- Los productos por defecto se insertan solo si la tabla está vacía
- Los pedidos eliminados también eliminan sus items (CASCADE)
- La base de datos es local y no se sincroniza automáticamente

---

¡La aplicación ahora tiene una base de datos robusta y escalable! 🎉

