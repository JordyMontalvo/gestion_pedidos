import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePedidos } from '../context/PedidosContext';
import { useNavigation } from '@react-navigation/native';

const CarritoScreen = () => {
  const {
    carrito,
    eliminarDelCarrito,
    actualizarCantidad,
    calcularTotal,
    crearPedido,
    limpiarCarrito,
  } = usePedidos();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteNombre, setClienteNombre] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [mesa, setMesa] = useState('');
  const mesasDisponibles = ['Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4', 'Mesa 5', 'Mostrador', 'Para Llevar', 'Delivery'];

  const handleConfirmarPedido = () => {
    if (carrito.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos al carrito antes de confirmar');
      return;
    }

    setModalVisible(true);
  };

  const handleFinalizarPedido = async () => {
    try {
      const pedido = await crearPedido(clienteNombre, observaciones, mesa);
      setModalVisible(false);
      setClienteNombre('');
      setObservaciones('');
      setMesa('');
      
      Alert.alert(
        'Pedido creado',
        `Pedido #${pedido.id} creado exitosamente`,
        [
          {
            text: 'Ver pedidos',
            onPress: () => navigation.navigate('Pedidos'),
          },
          { text: 'OK' },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el pedido. Intenta nuevamente.');
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <View style={styles.itemIconContainer}>
          <Text style={styles.itemIcon}>{item.imagen || '🍕'}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemNombre}>{item.nombre}</Text>
          <Text style={styles.itemPrecioUnit}>S/ {item.precio.toFixed(2)} c/u</Text>
        </View>
      </View>
      
      <View style={styles.itemRight}>
        <View style={styles.cantidadContainer}>
          <TouchableOpacity
            style={[styles.cantidadButton, item.cantidad === 1 && styles.cantidadButtonDisabled]}
            onPress={() => actualizarCantidad(item.id, item.cantidad - 1)}
            disabled={item.cantidad === 1}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={18} color={item.cantidad === 1 ? "#ccc" : "#FF6B00"} />
          </TouchableOpacity>
          
          <View style={styles.cantidadBadge}>
            <Text style={styles.cantidadText}>{item.cantidad}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.cantidadButton}
            onPress={() => actualizarCantidad(item.id, item.cantidad + 1)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={18} color="#FF6B00" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotal}>S/ {(item.precio * item.cantidad).toFixed(2)}</Text>
          <TouchableOpacity
            onPress={() => eliminarDelCarrito(item.id)}
            style={styles.deleteButton}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={20} color="#ff3b30" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {carrito.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="cart-outline" size={80} color="#ddd" />
          </View>
          <Text style={styles.emptyText}>El carrito está vacío</Text>
          <Text style={styles.emptySubtext}>Agrega productos desde el menú</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('Productos')}
          >
            <Ionicons name="restaurant" size={20} color="#FF6B00" />
            <Text style={styles.emptyButtonText}>Ver Menú</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.headerInfo}>
            <Text style={styles.headerText}>
              {carrito.length} {carrito.length === 1 ? 'producto' : 'productos'} en el carrito
            </Text>
          </View>
          <FlatList
            data={carrito}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={[
              styles.listContainer,
              { paddingBottom: 140 + Math.max(insets.bottom, 0) }
            ]}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 0) + 70 }]}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total a pagar:</Text>
              <Text style={styles.totalAmount}>S/ {calcularTotal().toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmarPedido}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={24} color="#fff" style={styles.confirmIcon} />
              <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Información del Pedido</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre del cliente (opcional)"
              value={clienteNombre}
              onChangeText={setClienteNombre}
              placeholderTextColor="#999"
            />
            
            <View style={styles.mesaContainer}>
              <Text style={styles.label}>Mesa/Local:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mesasScroll}>
                {mesasDisponibles.map((mesaItem) => (
                  <TouchableOpacity
                    key={mesaItem}
                    style={[
                      styles.mesaButton,
                      mesa === mesaItem && styles.mesaButtonSelected
                    ]}
                    onPress={() => setMesa(mesa === mesaItem ? '' : mesaItem)}
                  >
                    <Text style={[
                      styles.mesaButtonText,
                      mesa === mesaItem && styles.mesaButtonTextSelected
                    ]}>
                      {mesaItem}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                placeholder="O escribir mesa personalizada..."
                value={mesa}
                onChangeText={setMesa}
                placeholderTextColor="#999"
              />
            </View>
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Observaciones (opcional)"
              value={observaciones}
              onChangeText={setObservaciones}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
              textAlignVertical="top"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmModalButton]}
                onPress={handleFinalizarPedido}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FF6B00',
    gap: 8,
  },
  emptyButtonText: {
    color: '#FF6B00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerInfo: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  headerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  listContainer: {
    padding: 12,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  itemLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  itemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFE0B2',
  },
  itemIcon: {
    fontSize: 28,
  },
  itemInfo: {
    flex: 1,
  },
  itemNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  itemPrecioUnit: {
    fontSize: 12,
    color: '#999',
  },
  itemRight: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cantidadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff3e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FF6B00',
  },
  cantidadButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  cantidadBadge: {
    minWidth: 40,
    height: 36,
    backgroundColor: '#FF6B00',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  cantidadText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtotalContainer: {
    alignItems: 'flex-end',
  },
  subtotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 8,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#ffebee',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: '#FF6B00',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  confirmButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    gap: 10,
  },
  confirmIcon: {
    marginRight: 0,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
    marginBottom: 24,
    color: '#1a1a1a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmModalButton: {
    backgroundColor: '#FF6B00',
  },
  mesaContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  mesasScroll: {
    marginBottom: 8,
  },
  mesaButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
  },
  mesaButtonSelected: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  mesaButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  mesaButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CarritoScreen;

