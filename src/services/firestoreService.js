import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== PRODUCTOS ====================

// Obtener todos los productos
export const obtenerProductos = async () => {
  try {
    const productosRef = collection(db, 'productos');
    // Ordenar solo por categoría para evitar necesidad de índice compuesto
    const q = query(productosRef, orderBy('categoria'));
    const querySnapshot = await getDocs(q);
    
    // Ordenar por nombre en JavaScript después de obtener los datos
    const productos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      disponible: doc.data().disponible ?? true,
    }));
    
    // Ordenar por categoría y luego por nombre en JavaScript
    return productos.sort((a, b) => {
      if (a.categoria !== b.categoria) {
        return a.categoria.localeCompare(b.categoria);
      }
      return a.nombre.localeCompare(b.nombre);
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

// Escuchar cambios en productos en tiempo real
export const suscribirProductos = (callback) => {
  const productosRef = collection(db, 'productos');
  // Ordenar solo por categoría para evitar necesidad de índice compuesto
  const q = query(productosRef, orderBy('categoria'));
  
  return onSnapshot(q, (querySnapshot) => {
    const productos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      disponible: doc.data().disponible ?? true,
    }));
    
    // Ordenar por categoría y luego por nombre en JavaScript
    productos.sort((a, b) => {
      if (a.categoria !== b.categoria) {
        return a.categoria.localeCompare(b.categoria);
      }
      return a.nombre.localeCompare(b.nombre);
    });
    
    callback(productos);
  }, (error) => {
    console.error('Error en suscripción de productos:', error);
    callback([]);
  });
};

// Obtener un producto por ID
export const obtenerProductoPorId = async (id) => {
  try {
    const productoRef = doc(db, 'productos', id);
    const productoSnap = await getDoc(productoRef);
    
    if (productoSnap.exists()) {
      return {
        id: productoSnap.id,
        ...productoSnap.data(),
        disponible: productoSnap.data().disponible ?? true,
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
    const productosRef = collection(db, 'productos');
    const docRef = await addDoc(productosRef, {
      ...producto,
      disponible: producto.disponible ?? true,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

// Actualizar un producto
export const actualizarProducto = async (id, producto) => {
  try {
    const productoRef = doc(db, 'productos', id);
    await updateDoc(productoRef, {
      ...producto,
      disponible: producto.disponible ?? true,
      updated_at: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

// Eliminar un producto
export const eliminarProducto = async (id) => {
  try {
    const productoRef = doc(db, 'productos', id);
    await deleteDoc(productoRef);
    return true;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

// ==================== PEDIDOS ====================

// Obtener todos los pedidos
export const obtenerPedidos = async () => {
  try {
    const pedidosRef = collection(db, 'pedidos');
    const q = query(pedidosRef, orderBy('fecha', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const pedidos = [];
    for (const docSnap of querySnapshot.docs) {
      const pedidoData = docSnap.data();
      // Obtener items del pedido
      const itemsRef = collection(db, 'pedidos', docSnap.id, 'items');
      const itemsSnapshot = await getDocs(itemsRef);
      const items = itemsSnapshot.docs.map(itemDoc => ({
        id: itemDoc.id,
        ...itemDoc.data(),
      }));
      
      pedidos.push({
        id: docSnap.id,
        ...pedidoData,
        items,
      });
    }
    
    return pedidos;
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    throw error;
  }
};

// Escuchar cambios en pedidos en tiempo real
export const suscribirPedidos = (callback) => {
  const pedidosRef = collection(db, 'pedidos');
  const q = query(pedidosRef, orderBy('fecha', 'desc'));
  
  return onSnapshot(q, async (querySnapshot) => {
    const pedidos = [];
    for (const docSnap of querySnapshot.docs) {
      const pedidoData = docSnap.data();
      // Obtener items del pedido
      const itemsRef = collection(db, 'pedidos', docSnap.id, 'items');
      const itemsSnapshot = await getDocs(itemsRef);
      const items = itemsSnapshot.docs.map(itemDoc => ({
        id: itemDoc.id,
        ...itemDoc.data(),
      }));
      
      pedidos.push({
        id: docSnap.id,
        ...pedidoData,
        items,
      });
    }
    callback(pedidos);
  }, (error) => {
    console.error('Error en suscripción de pedidos:', error);
    callback([]);
  });
};

// Obtener un pedido por ID
export const obtenerPedidoPorId = async (id) => {
  try {
    const pedidoRef = doc(db, 'pedidos', id);
    const pedidoSnap = await getDoc(pedidoRef);
    
    if (!pedidoSnap.exists()) return null;
    
    // Obtener items del pedido
    const itemsRef = collection(db, 'pedidos', id, 'items');
    const itemsSnapshot = await getDocs(itemsRef);
    const items = itemsSnapshot.docs.map(itemDoc => ({
      id: itemDoc.id,
      ...itemDoc.data(),
    }));
    
    return {
      id: pedidoSnap.id,
      ...pedidoSnap.data(),
      items,
    };
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    throw error;
  }
};

// Crear un nuevo pedido
export const crearPedido = async (pedido) => {
  try {
    const pedidosRef = collection(db, 'pedidos');
    
    // Crear el pedido
    const pedidoRef = await addDoc(pedidosRef, {
      fecha: pedido.fecha || new Date().toISOString(),
      clienteNombre: pedido.clienteNombre || null,
      observaciones: pedido.observaciones || null,
      estado: pedido.estado || 'pendiente',
      total: pedido.total,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    
    // Crear los items como subcolección
    const itemsRef = collection(db, 'pedidos', pedidoRef.id, 'items');
    for (const item of pedido.items) {
      await addDoc(itemsRef, {
        productoId: item.id,
        cantidad: item.cantidad,
        precio: item.precio,
        nombre: item.nombre,
        imagen: item.imagen || null,
        created_at: serverTimestamp(),
      });
    }
    
    // Retornar el pedido completo
    return await obtenerPedidoPorId(pedidoRef.id);
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
};

// Actualizar el estado de un pedido
export const actualizarEstadoPedido = async (id, nuevoEstado) => {
  try {
    const pedidoRef = doc(db, 'pedidos', id);
    await updateDoc(pedidoRef, {
      estado: nuevoEstado,
      updated_at: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    throw error;
  }
};

// Eliminar un pedido
export const eliminarPedido = async (id) => {
  try {
    // Primero eliminar los items
    const itemsRef = collection(db, 'pedidos', id, 'items');
    const itemsSnapshot = await getDocs(itemsRef);
    const deletePromises = itemsSnapshot.docs.map(itemDoc => 
      deleteDoc(doc(db, 'pedidos', id, 'items', itemDoc.id))
    );
    await Promise.all(deletePromises);
    
    // Luego eliminar el pedido
    const pedidoRef = doc(db, 'pedidos', id);
    await deleteDoc(pedidoRef);
    return true;
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    throw error;
  }
};

// Obtener pedidos filtrados por estado
export const obtenerPedidosPorEstado = async (estado) => {
  try {
    const pedidosRef = collection(db, 'pedidos');
    const q = query(
      pedidosRef, 
      where('estado', '==', estado),
      orderBy('fecha', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const pedidos = [];
    for (const docSnap of querySnapshot.docs) {
      const pedidoData = docSnap.data();
      const itemsRef = collection(db, 'pedidos', docSnap.id, 'items');
      const itemsSnapshot = await getDocs(itemsRef);
      const items = itemsSnapshot.docs.map(itemDoc => ({
        id: itemDoc.id,
        ...itemDoc.data(),
      }));
      
      pedidos.push({
        id: docSnap.id,
        ...pedidoData,
        items,
      });
    }
    
    return pedidos;
  } catch (error) {
    console.error('Error al obtener pedidos por estado:', error);
    throw error;
  }
};

// ==================== ESTADÍSTICAS ====================

export const obtenerEstadisticas = async () => {
  try {
    const pedidos = await obtenerPedidos();
    
    const stats = {
      totalPedidos: pedidos.length,
      pedidosPendientes: pedidos.filter(p => p.estado === 'pendiente').length,
      pedidosEnPreparacion: pedidos.filter(p => p.estado === 'en_preparacion').length,
      pedidosListos: pedidos.filter(p => p.estado === 'listo').length,
      totalVentas: pedidos.reduce((sum, p) => sum + (p.total || 0), 0),
    };
    
    return stats;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

// ==================== INICIALIZACIÓN ====================

// Insertar productos iniciales si no existen
export const inicializarProductosPorDefecto = async () => {
  try {
    const productos = await obtenerProductos();
    
    if (productos.length === 0) {
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
      
      console.log('Productos iniciales insertados en Firestore');
    }
  } catch (error) {
    console.error('Error al inicializar productos por defecto:', error);
    throw error;
  }
};

