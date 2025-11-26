import * as SQLite from 'expo-sqlite';

let db = null;

// Inicializar la base de datos
export const initDatabase = async () => {
  try {
    if (db) {
      return db; // Ya está inicializada
    }

    db = await SQLite.openDatabaseAsync('pedidos_polleria.db');
    
    // Habilitar foreign keys
    await db.execAsync('PRAGMA foreign_keys = ON;');
    
    // Crear tabla de productos
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precio REAL NOT NULL,
        categoria TEXT NOT NULL,
        imagen TEXT,
        descripcion TEXT,
        disponible INTEGER DEFAULT 1,
        created_at TEXT,
        updated_at TEXT
      )`
    );

    // Crear tabla de pedidos
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT NOT NULL,
        clienteNombre TEXT,
        observaciones TEXT,
        estado TEXT NOT NULL DEFAULT 'pendiente',
        total REAL NOT NULL,
        created_at TEXT,
        updated_at TEXT
      )`
    );

    // Crear tabla de items del pedido (relación muchos a muchos)
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS pedido_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedidoId INTEGER NOT NULL,
        productoId INTEGER NOT NULL,
        cantidad INTEGER NOT NULL,
        precio REAL NOT NULL,
        nombre TEXT NOT NULL,
        imagen TEXT,
        created_at TEXT,
        FOREIGN KEY (pedidoId) REFERENCES pedidos(id) ON DELETE CASCADE,
        FOREIGN KEY (productoId) REFERENCES productos(id)
      )`
    );

    // Crear índices para mejorar el rendimiento (uno por uno)
    await db.execAsync('CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado)');
    await db.execAsync('CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha)');
    await db.execAsync('CREATE INDEX IF NOT EXISTS idx_pedido_items_pedidoId ON pedido_items(pedidoId)');
    await db.execAsync('CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria)');

    console.log('Base de datos inicializada correctamente');
    return db;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    db = null; // Resetear en caso de error
    throw error;
  }
};

// Obtener la instancia de la base de datos
export const getDatabase = async () => {
  if (!db) {
    await initDatabase();
  }
  return db;
};

// ==================== PRODUCTOS ====================

// Obtener todos los productos
export const obtenerProductos = async () => {
  try {
    const database = await getDatabase();
    const result = await database.getAllAsync('SELECT * FROM productos ORDER BY categoria, nombre');
    return result.map(producto => ({
      ...producto,
      disponible: producto.disponible === 1,
    }));
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

// Obtener un producto por ID
export const obtenerProductoPorId = async (id) => {
  try {
    const database = await getDatabase();
    const result = await database.getFirstAsync('SELECT * FROM productos WHERE id = ?', [id]);
    if (result) {
      return {
        ...result,
        disponible: result.disponible === 1,
      };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener producto:', error);
    throw error;
  }
};

// Crear un nuevo producto
export const crearProducto = async (producto) => {
  try {
    const database = await getDatabase();
    const ahora = new Date().toISOString();
    const result = await database.runAsync(
      `INSERT INTO productos (nombre, precio, categoria, imagen, descripcion, disponible, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        producto.nombre,
        producto.precio,
        producto.categoria,
        producto.imagen || null,
        producto.descripcion || null,
        producto.disponible ? 1 : 0,
        ahora,
        ahora,
      ]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

// Actualizar un producto
export const actualizarProducto = async (id, producto) => {
  try {
    const database = await getDatabase();
    const ahora = new Date().toISOString();
    await database.runAsync(
      `UPDATE productos 
       SET nombre = ?, precio = ?, categoria = ?, imagen = ?, descripcion = ?, 
           disponible = ?, updated_at = ?
       WHERE id = ?`,
      [
        producto.nombre,
        producto.precio,
        producto.categoria,
        producto.imagen || null,
        producto.descripcion || null,
        producto.disponible ? 1 : 0,
        ahora,
        id,
      ]
    );
    return true;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

// Eliminar un producto
export const eliminarProducto = async (id) => {
  try {
    const database = await getDatabase();
    await database.runAsync('DELETE FROM productos WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

// ==================== PEDIDOS ====================

// Obtener todos los pedidos con sus items
export const obtenerPedidos = async () => {
  try {
    const database = await getDatabase();
    const pedidos = await database.getAllAsync(
      'SELECT * FROM pedidos ORDER BY fecha DESC'
    );

    // Obtener items para cada pedido
    const pedidosConItems = await Promise.all(
      pedidos.map(async (pedido) => {
        const items = await database.getAllAsync(
          'SELECT * FROM pedido_items WHERE pedidoId = ?',
          [pedido.id]
        );
        return {
          ...pedido,
          items: items.map(item => ({
            id: item.productoId,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad,
            imagen: item.imagen,
          })),
        };
      })
    );

    return pedidosConItems;
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    throw error;
  }
};

// Obtener un pedido por ID con sus items
export const obtenerPedidoPorId = async (id) => {
  try {
    const database = await getDatabase();
    const pedido = await database.getFirstAsync(
      'SELECT * FROM pedidos WHERE id = ?',
      [id]
    );

    if (!pedido) return null;

    const items = await database.getAllAsync(
      'SELECT * FROM pedido_items WHERE pedidoId = ?',
      [id]
    );

    return {
      ...pedido,
      items: items.map(item => ({
        id: item.productoId,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        imagen: item.imagen,
      })),
    };
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    throw error;
  }
};

// Crear un nuevo pedido con sus items
export const crearPedido = async (pedido) => {
  try {
    const database = await getDatabase();
    let pedidoId = null;
    
    // Iniciar transacción
    await database.withTransactionAsync(async () => {
      // Insertar el pedido
      const ahora = new Date().toISOString();
      const result = await database.runAsync(
        `INSERT INTO pedidos (fecha, clienteNombre, observaciones, estado, total, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          pedido.fecha || ahora,
          pedido.clienteNombre || null,
          pedido.observaciones || null,
          pedido.estado || 'pendiente',
          pedido.total,
          ahora,
          ahora,
        ]
      );

      pedidoId = result.lastInsertRowId;

      // Insertar los items del pedido
      const fechaItems = new Date().toISOString();
      for (const item of pedido.items) {
        await database.runAsync(
          `INSERT INTO pedido_items (pedidoId, productoId, cantidad, precio, nombre, imagen, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            pedidoId,
            item.id,
            item.cantidad,
            item.precio,
            item.nombre,
            item.imagen || null,
            fechaItems,
          ]
        );
      }
    });

    // Obtener el pedido completo creado
    if (pedidoId) {
      return await obtenerPedidoPorId(pedidoId);
    }
    throw new Error('No se pudo obtener el ID del pedido creado');
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
};

// Actualizar el estado de un pedido
export const actualizarEstadoPedido = async (id, nuevoEstado) => {
  try {
    const database = await getDatabase();
    const ahora = new Date().toISOString();
    await database.runAsync(
      'UPDATE pedidos SET estado = ?, updated_at = ? WHERE id = ?',
      [nuevoEstado, ahora, id]
    );
    return true;
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    throw error;
  }
};

// Eliminar un pedido (y sus items por CASCADE)
export const eliminarPedido = async (id) => {
  try {
    const database = await getDatabase();
    await database.runAsync('DELETE FROM pedidos WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    throw error;
  }
};

// ==================== UTILIDADES ====================

// Insertar productos iniciales si la tabla está vacía
export const inicializarProductosPorDefecto = async () => {
  try {
    const database = await getDatabase();
    const count = await database.getFirstAsync('SELECT COUNT(*) as count FROM productos');
    
    if (count.count === 0) {
      const productosIniciales = [
        { nombre: 'Pollo a la Brasa Entero', precio: 25.00, categoria: 'pollo', imagen: '🍗', disponible: true },
        { nombre: '1/4 de Pollo', precio: 8.50, categoria: 'pollo', imagen: '🍖', disponible: true },
        { nombre: '1/2 Pollo', precio: 15.00, categoria: 'pollo', imagen: '🍗', disponible: true },
        { nombre: 'Combo Familiar', precio: 45.00, categoria: 'combo', imagen: '🍽️', descripcion: '1 Pollo entero + 4 papas grandes + 4 ensaladas', disponible: true },
        { nombre: 'Combo Personal', precio: 12.00, categoria: 'combo', imagen: '🍱', descripcion: '1/4 pollo + papas + ensalada', disponible: true },
        { nombre: 'Papas Fritas', precio: 5.00, categoria: 'extras', imagen: '🍟', disponible: true },
        { nombre: 'Ensalada', precio: 4.00, categoria: 'extras', imagen: '🥗', disponible: true },
        { nombre: 'Inca Kola', precio: 3.50, categoria: 'bebidas', imagen: '🥤', disponible: true },
        { nombre: 'Coca Cola', precio: 3.50, categoria: 'bebidas', imagen: '🥤', disponible: true },
        { nombre: 'Agua Mineral', precio: 2.50, categoria: 'bebidas', imagen: '💧', disponible: true },
      ];

      for (const producto of productosIniciales) {
        await crearProducto(producto);
      }
      
      console.log('Productos iniciales insertados');
    }
  } catch (error) {
    console.error('Error al inicializar productos por defecto:', error);
    throw error;
  }
};

// Obtener estadísticas
export const obtenerEstadisticas = async () => {
  try {
    const database = await getDatabase();
    const stats = {
      totalPedidos: await database.getFirstAsync('SELECT COUNT(*) as count FROM pedidos'),
      pedidosPendientes: await database.getFirstAsync("SELECT COUNT(*) as count FROM pedidos WHERE estado = 'pendiente'"),
      pedidosEnPreparacion: await database.getFirstAsync("SELECT COUNT(*) as count FROM pedidos WHERE estado = 'en_preparacion'"),
      pedidosListos: await database.getFirstAsync("SELECT COUNT(*) as count FROM pedidos WHERE estado = 'listo'"),
      totalVentas: await database.getFirstAsync('SELECT SUM(total) as total FROM pedidos'),
    };
    return stats;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

