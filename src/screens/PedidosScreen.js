import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePedidos } from '../context/PedidosContext';

const estados = ['pendiente', 'en_preparacion', 'listo', 'entregado'];
const coloresEstado = {
  pendiente: '#ff9800',
  en_preparacion: '#2196f3',
  listo: '#4caf50',
  entregado: '#9e9e9e',
};
const iconosEstado = {
  pendiente: 'time-outline',
  en_preparacion: 'restaurant-outline',
  listo: 'checkmark-circle-outline',
  entregado: 'checkmark-done-outline',
};

const PedidosScreen = () => {
  const { pedidos, actualizarEstadoPedido, eliminarPedido } = usePedidos();
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const pedidosFiltrados = pedidos.filter(pedido =>
    filtroEstado === 'todos' || pedido.estado === filtroEstado
  );

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const obtenerNombreEstado = (estado) => {
    const nombres = {
      pendiente: 'Pendiente',
      en_preparacion: 'En Preparación',
      listo: 'Listo',
      entregado: 'Entregado',
    };
    return nombres[estado] || estado;
  };

  const handleActualizarEstado = async (pedidoId, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(pedidoId, nuevoEstado);
      Alert.alert('Estado actualizado', `Pedido actualizado a: ${obtenerNombreEstado(nuevoEstado)}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado del pedido.');
      console.error(error);
    }
  };

  const handleEliminarPedido = (pedidoId) => {
    Alert.alert(
      'Eliminar pedido',
      '¿Estás seguro de que deseas eliminar este pedido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarPedido(pedidoId);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el pedido.');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const abrirDetalle = (pedido) => {
    setPedidoSeleccionado(pedido);
    setModalVisible(true);
  };

  const renderFiltro = ({ item }) => {
    const estaSeleccionado = filtroEstado === item;
    const cantidad = item === 'todos' 
      ? pedidos.length 
      : pedidos.filter(p => p.estado === item).length;
    
    return (
      <TouchableOpacity
        style={[
          styles.filtroButton,
          estaSeleccionado && styles.filtroButtonSelected,
        ]}
        onPress={() => setFiltroEstado(item)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.filtroText,
            estaSeleccionado && styles.filtroTextSelected,
          ]}
        >
          {item === 'todos' ? 'Todos' : obtenerNombreEstado(item)}
        </Text>
        {cantidad > 0 && (
          <View style={[
            styles.filtroBadge,
            estaSeleccionado && styles.filtroBadgeSelected
          ]}>
            <Text style={[
              styles.filtroBadgeText,
              estaSeleccionado && styles.filtroBadgeTextSelected
            ]}>
              {cantidad}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderPedido = ({ item }) => {
    const estadoActualIndex = estados.indexOf(item.estado);
    const siguienteEstado = estados[estadoActualIndex + 1];

    return (
      <TouchableOpacity
        style={[
          styles.pedidoCard,
          { borderLeftWidth: 4, borderLeftColor: coloresEstado[item.estado] }
        ]}
        onPress={() => abrirDetalle(item)}
        activeOpacity={0.7}
      >
        <View style={styles.pedidoHeader}>
          <View style={styles.pedidoHeaderLeft}>
            <View style={styles.pedidoIdContainer}>
              <Ionicons name="receipt" size={20} color="#FF6B00" />
              <Text style={styles.pedidoId}>Pedido #{item.id}</Text>
            </View>
            <Text style={styles.pedidoFecha}>{formatearFecha(item.fecha)}</Text>
            {item.clienteNombre && (
              <View style={styles.clienteContainer}>
                <Ionicons name="person" size={14} color="#FF6B00" />
                <Text style={styles.clienteNombre}>{item.clienteNombre}</Text>
              </View>
            )}
          </View>
          <View
            style={[
              styles.estadoBadge,
              { backgroundColor: coloresEstado[item.estado] },
            ]}
          >
            <Ionicons 
              name={iconosEstado[item.estado]} 
              size={14} 
              color="#fff" 
              style={styles.estadoIcon}
            />
            <Text style={styles.estadoText}>
              {obtenerNombreEstado(item.estado)}
            </Text>
          </View>
        </View>

        <View style={styles.pedidoInfo}>
          <View style={styles.itemsInfo}>
            <Ionicons name="cube-outline" size={16} color="#666" />
            <Text style={styles.itemsCount}>
              {item.items.length} {item.items.length === 1 ? 'producto' : 'productos'}
            </Text>
          </View>
          <View style={styles.totalInfo}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.pedidoTotal}>S/ {item.total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.accionesContainer}>
          {siguienteEstado && (
            <TouchableOpacity
              style={[styles.accionButton, styles.actualizarButton]}
              onPress={() => handleActualizarEstado(item.id, siguienteEstado)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={iconosEstado[siguienteEstado]} 
                size={18} 
                color="#FF6B00" 
                style={styles.accionIcon}
              />
              <Text style={styles.accionButtonText}>
                {obtenerNombreEstado(siguienteEstado)}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.accionButton, styles.eliminarButton]}
            onPress={() => handleEliminarPedido(item.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color="#ff3b30" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filtrosContainer}>
        <FlatList
          data={['todos', ...estados]}
          renderItem={renderFiltro}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtrosList}
        />
      </View>

      {pedidosFiltrados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="receipt-outline" size={80} color="#ddd" />
          </View>
          <Text style={styles.emptyText}>No hay pedidos</Text>
          <Text style={styles.emptySubtext}>
            {filtroEstado === 'todos'
              ? 'Los pedidos aparecerán aquí cuando los crees'
              : `No hay pedidos ${obtenerNombreEstado(filtroEstado).toLowerCase()}`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={pedidosFiltrados}
          renderItem={renderPedido}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {pedidoSeleccionado && (
              <ScrollView>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    Pedido #{pedidoSeleccionado.id}
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={30} color="#333" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalInfo}>
                  Fecha: {formatearFecha(pedidoSeleccionado.fecha)}
                </Text>
                
                {pedidoSeleccionado.clienteNombre && (
                  <Text style={styles.modalInfo}>
                    Cliente: {pedidoSeleccionado.clienteNombre}
                  </Text>
                )}

                <View
                  style={[
                    styles.estadoBadge,
                    {
                      backgroundColor:
                        coloresEstado[pedidoSeleccionado.estado],
                      alignSelf: 'flex-start',
                      marginVertical: 10,
                    },
                  ]}
                >
                  <Text style={styles.estadoText}>
                    {obtenerNombreEstado(pedidoSeleccionado.estado)}
                  </Text>
                </View>

                <Text style={styles.modalSectionTitle}>Items:</Text>
                {pedidoSeleccionado.items.map((item, index) => (
                  <View key={index} style={styles.modalItem}>
                    <Text style={styles.modalItemNombre}>{item.nombre}</Text>
                    <Text style={styles.modalItemCantidad}>
                      {item.cantidad} x S/ {item.precio.toFixed(2)} = S/{' '}
                      {(item.precio * item.cantidad).toFixed(2)}
                    </Text>
                  </View>
                ))}

                {pedidoSeleccionado.observaciones && (
                  <>
                    <Text style={styles.modalSectionTitle}>Observaciones:</Text>
                    <Text style={styles.modalObservaciones}>
                      {pedidoSeleccionado.observaciones}
                    </Text>
                  </>
                )}

                <View style={styles.modalTotal}>
                  <Text style={styles.modalTotalLabel}>Total:</Text>
                  <Text style={styles.modalTotalAmount}>
                    S/ {pedidoSeleccionado.total.toFixed(2)}
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  filtrosContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  filtrosList: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  filtroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  filtroButtonSelected: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  filtroText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filtroTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filtroBadge: {
    backgroundColor: '#fff',
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  filtroBadgeSelected: {
    backgroundColor: '#fff',
  },
  filtroBadgeText: {
    fontSize: 11,
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  filtroBadgeTextSelected: {
    color: '#FF6B00',
  },
  listContainer: {
    padding: 12,
  },
  pedidoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pedidoHeaderLeft: {
    flex: 1,
  },
  pedidoIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  pedidoId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  pedidoFecha: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  clienteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  clienteNombre: {
    fontSize: 14,
    color: '#FF6B00',
    fontWeight: '600',
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  estadoIcon: {
    marginRight: 0,
  },
  estadoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pedidoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  itemsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemsCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  totalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  pedidoTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  accionesContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  accionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actualizarButton: {
    backgroundColor: '#fff3e0',
    borderWidth: 1.5,
    borderColor: '#FF6B00',
  },
  accionIcon: {
    marginRight: 0,
  },
  accionButtonText: {
    color: '#FF6B00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  eliminarButton: {
    backgroundColor: '#ffebee',
    borderWidth: 1.5,
    borderColor: '#ff3b30',
    maxWidth: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  modalInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemNombre: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  modalItemCantidad: {
    fontSize: 14,
    color: '#666',
  },
  modalObservaciones: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  modalTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#FF6B00',
  },
  modalTotalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalTotalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
});

export default PedidosScreen;

