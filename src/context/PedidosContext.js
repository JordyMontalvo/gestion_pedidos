import React, { createContext, useContext, useState, useEffect } from 'react';
// Cambiar a Firestore para base de datos compartida
import {
  obtenerProductos,
  obtenerPedidos,
  crearPedido as crearPedidoDB,
  actualizarEstadoPedido as actualizarEstadoPedidoDB,
  eliminarPedido as eliminarPedidoDB,
  inicializarProductosPorDefecto,
  suscribirProductos,
  suscribirPedidos,
} from '../services/firestoreService';

const PedidosContext = createContext();

export const usePedidos = () => {
  const context = useContext(PedidosContext);
  if (!context) {
    throw new Error('usePedidos debe ser usado dentro de PedidosProvider');
  }
  return context;
};

export const PedidosProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [dbInicializada, setDbInicializada] = useState(false);

  // Inicializar Firestore y suscribirse a cambios en tiempo real
  useEffect(() => {
    inicializarDatos();
    
    // Suscribirse a cambios en tiempo real
    const unsubscribeProductos = suscribirProductos((productosDB) => {
      setProductos(productosDB);
    });
    
    const unsubscribePedidos = suscribirPedidos((pedidosDB) => {
      setPedidos(pedidosDB);
    });
    
    // Limpiar suscripciones al desmontar
    return () => {
      unsubscribeProductos();
      unsubscribePedidos();
    };
  }, []);

  const inicializarDatos = async () => {
    try {
      // Insertar productos por defecto si no existen
      await inicializarProductosPorDefecto();
      
      // Cargar productos desde Firestore (las suscripciones actualizarán automáticamente)
      const productosDB = await obtenerProductos();
      setProductos(productosDB);
      
      // Cargar pedidos desde Firestore (las suscripciones actualizarán automáticamente)
      const pedidosDB = await obtenerPedidos();
      setPedidos(pedidosDB);
      
      setDbInicializada(true);
      console.log('✅ Conectado a Firestore - Base de datos compartida');
    } catch (error) {
      console.error('❌ Error al inicializar datos de Firestore:', error);
      console.error('⚠️ Asegúrate de configurar las credenciales en src/services/firebase.js');
    }
  };

  const recargarPedidos = async () => {
    try {
      // Con Firestore, las suscripciones actualizan automáticamente
      // Pero podemos forzar una recarga si es necesario
      const pedidosDB = await obtenerPedidos();
      setPedidos(pedidosDB);
    } catch (error) {
      console.error('Error al recargar pedidos:', error);
    }
  };

  const recargarProductos = async () => {
    try {
      // Con Firestore, las suscripciones actualizan automáticamente
      // Pero podemos forzar una recarga si es necesario
      const productosDB = await obtenerProductos();
      setProductos(productosDB);
    } catch (error) {
      console.error('Error al recargar productos:', error);
    }
  };

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito(prevCarrito => {
      const itemExistente = prevCarrito.find(item => item.id === producto.id);
      
      if (itemExistente) {
        return prevCarrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      
      return [...prevCarrito, { ...producto, cantidad }];
    });
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== productoId));
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }
    
    setCarrito(prevCarrito =>
      prevCarrito.map(item =>
        item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const crearPedido = async (clienteNombre = '', observaciones = '') => {
    try {
      const nuevoPedido = {
        fecha: new Date().toISOString(),
        items: [...carrito],
        total: calcularTotal(),
        clienteNombre,
        observaciones,
        estado: 'pendiente'
      };

      // Guardar en la base de datos
      const pedidoCreado = await crearPedidoDB(nuevoPedido);
      
      // Recargar pedidos desde la base de datos
      await recargarPedidos();
      
      // Limpiar el carrito
      limpiarCarrito();
      
      return pedidoCreado;
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  };

  const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      await actualizarEstadoPedidoDB(pedidoId, nuevoEstado);
      await recargarPedidos();
    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error);
      throw error;
    }
  };

  const eliminarPedido = async (pedidoId) => {
    try {
      await eliminarPedidoDB(pedidoId);
      await recargarPedidos();
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      throw error;
    }
  };

  const value = {
    productos,
    carrito,
    pedidos,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    limpiarCarrito,
    calcularTotal,
    crearPedido,
    actualizarEstadoPedido,
    eliminarPedido,
    recargarPedidos,
    recargarProductos,
  };

  return (
    <PedidosContext.Provider value={value}>
      {children}
    </PedidosContext.Provider>
  );
};

