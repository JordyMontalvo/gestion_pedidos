import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView as SafeArea, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePedidos } from '../context/PedidosContext';
import { enviarNotificacionLocal } from '../services/notificationService';

const estadosCocina = ['pendiente', 'en_preparacion'];

const CocinaScreen = () => {
  const { pedidos, actualizarEstadoPedido } = usePedidos();
  const insets = useSafeAreaInsets();
  
  // Filtrar solo pedidos que están en cocina
  const pedidosCocina = pedidos.filter(p => estadosCocina.includes(p.estado));
  
  // Ordenar: pendientes primero, luego por fecha más antigua
  const pedidosOrdenados = pedidosCocina.sort((a, b) => {
    if (a.estado !== b.estado) {
      return a.estado === 'pendiente' ? -1 : 1;
    }
    return new Date(a.fecha) - new Date(b.fecha);
  });

  const formatearTiempo = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const minutos = Math.floor((ahora - fecha) / (1000 * 60));
    
    if (minutos < 1) return 'Ahora';
    if (minutos < 60) return `Hace ${minutos} min`;
    const horas = Math.floor(minutos / 60);
    return `Hace ${horas}h ${minutos % 60}m`;
  };

  const obtenerNombreEstado = (estado) => {
    const nombres = {
      pendiente: 'Pendiente',
      en_preparacion: 'En Preparación',
    };
    return nombres[estado] || estado;
  };

  const handleCambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(pedidoId, nuevoEstado);
      
      // Sonido de confirmación
      await enviarNotificacionLocal(
        '✅ Estado Actualizado',
        `Pedido #${pedidoId?.substring(0, 8) || 'N/A'} ahora está ${obtenerNombreEstado(nuevoEstado)}`
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado');
      console.error(error);
    }
  };

  const renderPedido = ({ item }) => {
    const esPendiente = item.estado === 'pendiente';
    const siguienteEstado = esPendiente ? 'en_preparacion' : 'listo';
    const siguienteNombre = esPendiente ? 'En Preparación' : 'Listo';

    return (
      <View style={[
        styles.pedidoCard,
        esPendiente && styles.pedidoCardUrgente
      ]}>
        <View style={styles.pedidoHeader}>
          <View style={styles.pedidoHeaderLeft}>
            <Text style={styles.pedidoId}>Pedido #{item.id?.substring(0, 8) || 'N/A'}</Text>
            <Text style={styles.pedidoTiempo}>{formatearTiempo(item.fecha)}</Text>
            {item.mesa && (
              <Text style={styles.pedidoMesa}>📍 {item.mesa}</Text>
            )}
          </View>
          <View style={[
            styles.estadoBadge,
            { backgroundColor: esPendiente ? '#ff9800' : '#2196f3' }
          ]}>
            <Text style={styles.estadoText}>
              {obtenerNombreEstado(item.estado)}
            </Text>
          </View>
        </View>

        <View style={styles.productosContainer}>
          {item.items?.map((producto, index) => (
            <View key={index} style={styles.productoItem}>
              <Text style={styles.productoCantidad}>{producto.cantidad}x</Text>
              <Text style={styles.productoNombre}>{producto.nombre}</Text>
            </View>
          ))}
        </View>

        {item.observaciones && (
          <View style={styles.observacionesContainer}>
            <Ionicons name="information-circle" size={16} color="#FF6B00" />
            <Text style={styles.observacionesText}>{item.observaciones}</Text>
          </View>
        )}

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total: S/ {item.total?.toFixed(2) || '0.00'}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.accionButton,
            { backgroundColor: esPendiente ? '#2196f3' : '#4caf50' }
          ]}
          onPress={() => handleCambiarEstado(item.id, siguienteEstado)}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={esPendiente ? 'play' : 'checkmark-circle'} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.accionButtonText}>
            Marcar como {siguienteNombre}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeArea style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>👨‍🍳 Cocina</Text>
          <Text style={styles.headerSubtitle}>
            {pedidosOrdenados.length} pedido{pedidosOrdenados.length !== 1 ? 's' : ''} en cocina
          </Text>
        </View>
        {pedidosOrdenados.filter(p => p.estado === 'pendiente').length > 0 && (
          <View style={styles.urgenteBadge}>
            <Text style={styles.urgenteText}>
              {pedidosOrdenados.filter(p => p.estado === 'pendiente').length} urgente{pedidosOrdenados.filter(p => p.estado === 'pendiente').length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      {pedidosOrdenados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-done-circle" size={80} color="#4caf50" />
          <Text style={styles.emptyText}>¡Todo al día! 🎉</Text>
          <Text style={styles.emptySubtext}>No hay pedidos en cocina</Text>
        </View>
      ) : (
        <FlatList
          data={pedidosOrdenados}
          renderItem={renderPedido}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: 80 + Math.max(insets.bottom, 0) }
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B00',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  urgenteBadge: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  urgenteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContainer: {
    padding: 15,
  },
  pedidoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  pedidoCardUrgente: {
    borderColor: '#ff9800',
    borderWidth: 3,
    backgroundColor: '#fff8e1',
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  pedidoHeaderLeft: {
    flex: 1,
  },
  pedidoId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  pedidoTiempo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  pedidoMesa: {
    fontSize: 14,
    color: '#FF6B00',
    fontWeight: '600',
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  estadoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  productosContainer: {
    marginBottom: 15,
  },
  productoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  productoCantidad: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B00',
    width: 40,
    marginRight: 10,
  },
  productoNombre: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  observacionesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    gap: 8,
  },
  observacionesText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  totalContainer: {
    alignItems: 'flex-end',
    marginBottom: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  accionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  accionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});

export default CocinaScreen;

