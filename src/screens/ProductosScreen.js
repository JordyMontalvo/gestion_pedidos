import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePedidos } from '../context/PedidosContext';
import ProductoCard from '../components/ProductoCard';

const categorias = [
  { id: 'todos', nombre: 'Todos', icon: 'grid' },
  { id: 'pollo', nombre: 'Pollo', icon: 'restaurant' },
  { id: 'combo', nombre: 'Combos', icon: 'fast-food' },
  { id: 'extras', nombre: 'Extras', icon: 'pizza' },
  { id: 'bebidas', nombre: 'Bebidas', icon: 'water' },
];

const ProductosScreen = () => {
  const { productos, agregarAlCarrito, carrito } = usePedidos();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  const productosFiltrados = productos.filter(producto => {
    const coincideCategoria = categoriaSeleccionada === 'todos' || producto.categoria === categoriaSeleccionada;
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda && producto.disponible;
  });

  const totalItemsCarrito = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  const renderProducto = ({ item }) => (
    <ProductoCard
      producto={item}
      onAgregar={(producto) => agregarAlCarrito(producto, 1)}
    />
  );

  const renderCategoria = ({ item }) => {
    const estaSeleccionada = categoriaSeleccionada === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.categoriaButton,
          estaSeleccionada && styles.categoriaButtonSelected
        ]}
        onPress={() => setCategoriaSeleccionada(item.id)}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={item.icon} 
          size={18} 
          color={estaSeleccionada ? '#fff' : '#FF6B00'} 
          style={styles.categoriaIcon}
        />
        <Text
          style={[
            styles.categoriaText,
            estaSeleccionada && styles.categoriaTextSelected
          ]}
        >
          {item.nombre}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar producto..."
            value={busqueda}
            onChangeText={setBusqueda}
            placeholderTextColor="#999"
          />
          {busqueda.length > 0 && (
            <TouchableOpacity onPress={() => setBusqueda('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        {totalItemsCarrito > 0 && (
          <View style={styles.carritoBadge}>
            <Text style={styles.carritoBadgeText}>{totalItemsCarrito}</Text>
          </View>
        )}
      </View>

      <View style={styles.categoriasContainer}>
        <FlatList
          data={categorias}
          renderItem={renderCategoria}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriasList}
        />
      </View>

      {productosFiltrados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No se encontraron productos</Text>
          <Text style={styles.emptySubtext}>
            {busqueda ? 'Intenta con otra búsqueda' : 'No hay productos en esta categoría'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={productosFiltrados}
          renderItem={renderProducto}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productosList}
          columnWrapperStyle={styles.productosRow}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    marginLeft: 10,
  },
  carritoBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF6B00',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  carritoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoriasContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  categoriasList: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  categoriaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoriaButtonSelected: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriaIcon: {
    marginRight: 6,
  },
  categoriaText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  categoriaTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productosList: {
    padding: 8,
  },
  productosRow: {
    justifyContent: 'space-between',
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
});

export default ProductosScreen;

