import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView as SafeArea, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePedidos } from '../context/PedidosContext';
import { enviarNotificacionLocal } from '../services/notificationService';
import { actualizarEstadoPedido as actualizarEstadoPedidoDB } from '../services/firestoreService';

const METODOS_PAGO = [
  { id: 'efectivo', nombre: 'Efectivo', icon: 'cash', color: '#4caf50' },
  { id: 'tarjeta', nombre: 'Tarjeta', icon: 'card', color: '#2196f3' },
  { id: 'yape', nombre: 'Yape', icon: 'phone-portrait', color: '#FFC107' },
  { id: 'transferencia', nombre: 'Transferencia', icon: 'swap-horizontal', color: '#9c27b0' },
];

const CajaScreen = () => {
  const { pedidos } = usePedidos();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [metodoPago, setMetodoPago] = useState('');

  // Solo pedidos listos
  const pedidosListos = pedidos.filter(p => p.estado === 'listo');
  
  // Calcular total del día
  const pedidosDelDia = pedidos.filter(p => {
    const fechaPedido = new Date(p.fecha);
    const hoy = new Date();
    return fechaPedido.toDateString() === hoy.toDateString();
  });
  
  const totalDelDia = pedidosDelDia
    .filter(p => p.estado === 'entregado' && p.metodoPago)
    .reduce((sum, p) => sum + (p.total || 0), 0);

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const abrirModalCobro = (pedido) => {
    setPedidoSeleccionado(pedido);
    setMetodoPago('');
    setModalVisible(true);
  };

  const handleCobrar = async () => {
    if (!metodoPago) {
      Alert.alert('Error', 'Selecciona un método de pago');
      return;
    }

    try {
      // Actualizar pedido con método de pago y estado
      await actualizarEstadoPedidoDB(pedidoSeleccionado.id, 'entregado', metodoPago);
      
      // Notificación
      await enviarNotificacionLocal(
        '💰 Pedido Cobrado',
        `Pedido #${pedidoSeleccionado.id?.substring(0, 8) || 'N/A'} cobrado con ${METODOS_PAGO.find(m => m.id === metodoPago)?.nombre || metodoPago}`
      );

      setModalVisible(false);
      setPedidoSeleccionado(null);
      setMetodoPago('');
      
      Alert.alert('✅ Éxito', 'Pedido cobrado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cobrar el pedido');
      console.error(error);
    }
  };

  const renderPedido = ({ item }) => {
    const tiempoEspera = Math.floor((new Date() - new Date(item.fecha)) / (1000 * 60));

    return (
      <TouchableOpacity
        style={styles.pedidoCard}
        onPress={() => abrirModalCobro(item)}
        activeOpacity={0.7}
      >
        <View style={styles.pedidoHeader}>
          <View style={styles.pedidoHeaderLeft}>
            <Text style={styles.pedidoId}>Pedido #{item.id?.substring(0, 8) || 'N/A'}</Text>
            <Text style={styles.pedidoFecha}>{formatearFecha(item.fecha)}</Text>
            {item.mesa && (
              <Text style={styles.pedidoMesa}>📍 {item.mesa}</Text>
            )}
            {item.clienteNombre && (
              <Text style={styles.pedidoCliente}>👤 {item.clienteNombre}</Text>
            )}
          </View>
          <View style={styles.estadoBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#4caf50" />
            <Text style={styles.estadoText}>Listo</Text>
          </View>
        </View>

        <View style={styles.productosResumen}>
          <Text style={styles.productosText}>
            {item.items?.length || 0} producto{item.items?.length !== 1 ? 's' : ''}
          </Text>
          {tiempoEspera > 10 && (
            <View style={styles.alertaContainer}>
              <Ionicons name="time" size={16} color="#ff9800" />
              <Text style={styles.alertaText}>Esperando {tiempoEspera} min</Text>
            </View>
          )}
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total a cobrar:</Text>
          <Text style={styles.totalAmount}>S/ {item.total?.toFixed(2) || '0.00'}</Text>
        </View>

        <TouchableOpacity
          style={styles.cobrarButton}
          onPress={() => abrirModalCobro(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="cash" size={24} color="#fff" />
          <Text style={styles.cobrarButtonText}>Cobrar</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeArea style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>💰 Caja</Text>
          <Text style={styles.headerSubtitle}>
            {pedidosListos.length} pedido{pedidosListos.length !== 1 ? 's' : ''} listo{pedidosListos.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.totalDiaContainer}>
          <Text style={styles.totalDiaLabel}>Ventas hoy</Text>
          <Text style={styles.totalDiaAmount}>S/ {totalDelDia.toFixed(2)}</Text>
        </View>
      </View>

      {pedidosListos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No hay pedidos listos</Text>
          <Text style={styles.emptySubtext}>Los pedidos listos aparecerán aquí</Text>
        </View>
      ) : (
        <FlatList
          data={pedidosListos}
          renderItem={renderPedido}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: 80 + Math.max(insets.bottom, 0) }
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal de Cobro */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cobrar Pedido</Text>
            
            {pedidoSeleccionado && (
              <>
                <View style={styles.modalPedidoInfo}>
                  <Text style={styles.modalPedidoId}>
                    Pedido #{pedidoSeleccionado.id?.substring(0, 8) || 'N/A'}
                  </Text>
                  <Text style={styles.modalTotal}>
                    Total: S/ {pedidoSeleccionado.total?.toFixed(2) || '0.00'}
                  </Text>
                </View>

                <Text style={styles.modalSubtitle}>Método de pago:</Text>
                
                <View style={styles.metodosContainer}>
                  {METODOS_PAGO.map((metodo) => (
                    <TouchableOpacity
                      key={metodo.id}
                      style={[
                        styles.metodoButton,
                        metodoPago === metodo.id && styles.metodoButtonSelected,
                        { borderColor: metodo.color }
                      ]}
                      onPress={() => setMetodoPago(metodo.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={metodo.icon}
                        size={28}
                        color={metodoPago === metodo.id ? '#fff' : metodo.color}
                      />
                      <Text style={[
                        styles.metodoText,
                        metodoPago === metodo.id && styles.metodoTextSelected,
                        { color: metodoPago === metodo.id ? '#fff' : metodo.color }
                      ]}>
                        {metodo.nombre}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleCobrar}
                    disabled={!metodoPago}
                  >
                    <Text style={styles.confirmButtonText}>Cobrar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    borderBottomColor: '#2196f3',
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
  totalDiaContainer: {
    alignItems: 'flex-end',
  },
  totalDiaLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  totalDiaAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
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
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
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
  pedidoFecha: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  pedidoMesa: {
    fontSize: 14,
    color: '#2196f3',
    fontWeight: '600',
    marginBottom: 4,
  },
  pedidoCliente: {
    fontSize: 14,
    color: '#666',
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  estadoText: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 12,
  },
  productosResumen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  productosText: {
    fontSize: 14,
    color: '#666',
  },
  alertaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  alertaText: {
    fontSize: 12,
    color: '#ff9800',
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  cobrarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4caf50',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cobrarButtonText: {
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  modalPedidoInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalPedidoId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  modalTotal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 15,
  },
  metodosContainer: {
    gap: 12,
    marginBottom: 20,
  },
  metodoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
  },
  metodoButtonSelected: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
  },
  metodoText: {
    fontSize: 16,
    fontWeight: '600',
  },
  metodoTextSelected: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#4caf50',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CajaScreen;

