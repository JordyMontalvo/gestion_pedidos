import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
import { 
  solicitarPermisos, 
  enviarNotificacionLocal,
  configurarListenerNotificaciones 
} from '../services/notificationService';

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
  const pedidosAnterioresRef = useRef([]);
  const notificacionesInicializadas = useRef(false);

  // Inicializar Firestore y suscribirse a cambios en tiempo real
  useEffect(() => {
    inicializarDatos();
    inicializarNotificaciones();
    
    // Suscribirse a cambios en tiempo real
    const unsubscribeProductos = suscribirProductos((productosDB) => {
      setProductos(productosDB);
    });
    
    const unsubscribePedidos = suscribirPedidos((pedidosDB) => {
      // Detectar nuevos pedidos
      if (pedidosAnterioresRef.current.length > 0 && pedidosDB.length > pedidosAnterioresRef.current.length) {
        const nuevosPedidos = pedidosDB.filter(p => 
          !pedidosAnterioresRef.current.some(pa => pa.id === p.id)
        );
        
        nuevosPedidos.forEach(pedido => {
          const pedidoId = pedido?.id?.toString() || 'Nuevo';
          const pedidoIdShort = typeof pedidoId === 'string' && pedidoId.length > 8 
            ? pedidoId.substring(0, 8) 
            : pedidoId;
          const total = pedido?.total || 0;
          
          // Notificación con sonido para cocina
          enviarNotificacionLocal(
            '🍗 Nuevo Pedido',
            `Pedido #${pedidoIdShort} - S/ ${typeof total === 'number' ? total.toFixed(2) : '0.00'}`,
            { pedidoId: String(pedidoId), tipo: 'nuevo_pedido' }
          ).catch(error => {
            console.error('Error al enviar notificación de nuevo pedido:', error);
          });
        });
      }
      
      pedidosAnterioresRef.current = pedidosDB;
      setPedidos(pedidosDB);
    });
    
    // Limpiar suscripciones al desmontar
    return () => {
      unsubscribeProductos();
      unsubscribePedidos();
    };
  }, []);

  const inicializarNotificaciones = async () => {
    if (notificacionesInicializadas.current) return;
    
    try {
      const tienePermisos = await solicitarPermisos();
      if (tienePermisos) {
        notificacionesInicializadas.current = true;
        console.log('✅ Notificaciones configuradas');
      }
    } catch (error) {
      console.error('Error al inicializar notificaciones:', error);
    }
  };

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

  const crearPedido = async (clienteNombre = '', observaciones = '', mesa = '') => {
    try {
      const nuevoPedido = {
        fecha: new Date().toISOString(),
        items: [...carrito],
        total: calcularTotal(),
        clienteNombre,
        observaciones,
        mesa: mesa || null,
        estado: 'pendiente'
      };

      // Guardar en la base de datos
      const pedidoCreado = await crearPedidoDB(nuevoPedido);
      
      // Enviar notificación local con sonido
      try {
        const pedidoId = pedidoCreado?.id || pedidoCreado?.id?.toString() || 'Nuevo';
        const pedidoIdShort = typeof pedidoId === 'string' && pedidoId.length > 8 
          ? pedidoId.substring(0, 8) 
          : pedidoId;
        
        await enviarNotificacionLocal(
          '✅ Pedido Creado',
          `Pedido #${pedidoIdShort} creado exitosamente`,
          { pedidoId: pedidoId.toString(), tipo: 'pedido_creado' }
        );
      } catch (notifError) {
        console.error('Error al enviar notificación (no crítico):', notifError);
      }
      
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
      
      // Enviar notificación cuando cambia el estado
      const nombresEstado = {
        pendiente: '⏳ Pendiente',
        en_preparacion: '👨‍🍳 En Preparación',
        listo: '✅ Listo',
        entregado: '🎉 Entregado'
      };
      
      try {
        const pedidoIdStr = pedidoId?.toString() || 'N/A';
        const pedidoIdShort = typeof pedidoIdStr === 'string' && pedidoIdStr.length > 8 
          ? pedidoIdStr.substring(0, 8) 
          : pedidoIdStr;
        
        await enviarNotificacionLocal(
          '📦 Estado Actualizado',
          `Pedido #${pedidoIdShort}: ${nombresEstado[nuevoEstado] || nuevoEstado}`,
          { pedidoId: pedidoIdStr, nuevoEstado, tipo: 'estado_actualizado' }
        );
      } catch (notifError) {
        console.error('Error al enviar notificación (no crítico):', notifError);
      }
      
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

