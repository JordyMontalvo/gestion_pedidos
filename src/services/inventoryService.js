// Servicio para gestión de inventario/stock
import {
  obtenerProductos,
  actualizarProducto,
  obtenerProductoPorId,
} from './firestoreService';

// Verificar stock disponible
export const verificarStock = async (productoId, cantidad) => {
  try {
    const producto = await obtenerProductoPorId(productoId);
    
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    // Si no tiene stock configurado, asumir disponible
    if (producto.stock === undefined || producto.stock === null) {
      return { disponible: true, stock: null };
    }

    const disponible = producto.stock >= cantidad;
    return {
      disponible,
      stock: producto.stock,
      cantidadSolicitada: cantidad,
    };
  } catch (error) {
    console.error('Error al verificar stock:', error);
    throw error;
  }
};

// Reducir stock
export const reducirStock = async (productoId, cantidad) => {
  try {
    const producto = await obtenerProductoPorId(productoId);
    
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    // Si no tiene stock configurado, no hacer nada
    if (producto.stock === undefined || producto.stock === null) {
      return true;
    }

    const nuevoStock = Math.max(0, producto.stock - cantidad);
    
    await actualizarProducto(productoId, {
      ...producto,
      stock: nuevoStock,
      disponible: nuevoStock > 0,
    });

    return true;
  } catch (error) {
    console.error('Error al reducir stock:', error);
    throw error;
  }
};

// Aumentar stock
export const aumentarStock = async (productoId, cantidad) => {
  try {
    const producto = await obtenerProductoPorId(productoId);
    
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    const stockActual = producto.stock || 0;
    const nuevoStock = stockActual + cantidad;
    
    await actualizarProducto(productoId, {
      ...producto,
      stock: nuevoStock,
      disponible: nuevoStock > 0,
    });

    return true;
  } catch (error) {
    console.error('Error al aumentar stock:', error);
    throw error;
  }
};

// Obtener productos con stock bajo
export const obtenerProductosStockBajo = async (umbral = 5) => {
  try {
    const productos = await obtenerProductos();
    
    return productos.filter(producto => {
      if (producto.stock === undefined || producto.stock === null) {
        return false;
      }
      return producto.stock <= umbral && producto.stock > 0;
    });
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    return [];
  }
};

// Obtener productos agotados
export const obtenerProductosAgotados = async () => {
  try {
    const productos = await obtenerProductos();
    
    return productos.filter(producto => {
      if (producto.stock === undefined || producto.stock === null) {
        return false;
      }
      return producto.stock === 0;
    });
  } catch (error) {
    console.error('Error al obtener productos agotados:', error);
    return [];
  }
};

