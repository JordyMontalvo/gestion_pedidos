import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PedidosBadge = ({ cantidad, color, size }) => {
  if (!cantidad || cantidad === 0) {
    return <Ionicons name="receipt-outline" size={size} color={color} />;
  }

  return (
    <View style={styles.iconContainer}>
      <Ionicons name="receipt" size={size} color={color} />
      {cantidad > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cantidad > 99 ? '99+' : cantidad}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: '#ff9800',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default PedidosBadge;


