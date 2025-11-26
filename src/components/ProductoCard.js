import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductoCard = ({ producto, onAgregar }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onAgregar(producto);
  };

  const getCategoriaIcon = (categoria) => {
    const iconos = {
      pollo: '🍗',
      combo: '🍽️',
      extras: '🍟',
      bebidas: '🥤',
    };
    return iconos[categoria] || '🍕';
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.imagenContainer}>
        <View style={styles.imagenWrapper}>
          <Text style={styles.imagen}>{producto.imagen || getCategoriaIcon(producto.categoria)}</Text>
        </View>
        {producto.categoria && (
          <View style={styles.categoriaBadge}>
            <Text style={styles.categoriaText}>{producto.categoria}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.nombre} numberOfLines={2}>
          {producto.nombre}
        </Text>
        
        {producto.descripcion && (
          <Text style={styles.descripcion} numberOfLines={2}>
            {producto.descripcion}
          </Text>
        )}
        
        <View style={styles.precioContainer}>
          <Text style={styles.precioLabel}>Precio:</Text>
          <Text style={styles.precio}>S/ {producto.precio.toFixed(2)}</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.agregarButton}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.agregarText}>Agregar</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    margin: 6,
    width: '47%',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imagenContainer: {
    alignItems: 'center',
    marginBottom: 12,
    height: 90,
    justifyContent: 'center',
    position: 'relative',
  },
  imagenWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE0B2',
  },
  imagen: {
    fontSize: 40,
  },
  categoriaBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF6B00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoriaText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  infoContainer: {
    flex: 1,
    marginBottom: 8,
  },
  nombre: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 6,
    minHeight: 40,
    lineHeight: 20,
  },
  descripcion: {
    fontSize: 11,
    color: '#666',
    marginBottom: 10,
    minHeight: 30,
    lineHeight: 14,
  },
  precioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  precioLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  precio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  agregarButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  agregarText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default ProductoCard;

