import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { usePedidos } from '../context/PedidosContext';
import ProductosScreen from '../screens/ProductosScreen';
import CarritoScreen from '../screens/CarritoScreen';
import PedidosScreen from '../screens/PedidosScreen';
import AdminScreen from '../screens/AdminScreen';

const Tab = createBottomTabNavigator();

const CarritoIconWithBadge = ({ color, size }) => {
  const { carrito } = usePedidos();
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <View style={styles.iconContainer}>
      <Ionicons name="cart" size={size} color={color} />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems > 99 ? '99+' : totalItems}</Text>
        </View>
      )}
    </View>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Productos') {
            return <Ionicons name={focused ? 'restaurant' : 'restaurant-outline'} size={size} color={color} />;
          } else if (route.name === 'Carrito') {
            return <CarritoIconWithBadge color={color} size={size} />;
          } else if (route.name === 'Pedidos') {
            return <Ionicons name={focused ? 'receipt' : 'receipt-outline'} size={size} color={color} />;
          } else if (route.name === 'Admin') {
            return <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#FF6B00',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e8e8e8',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#FF6B00',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen 
        name="Productos" 
        component={ProductosScreen}
        options={{ title: 'Menú' }}
      />
      <Tab.Screen 
        name="Carrito" 
        component={CarritoScreen}
        options={{ title: 'Carrito' }}
      />
      <Tab.Screen 
        name="Pedidos" 
        component={PedidosScreen}
        options={{ title: 'Pedidos' }}
      />
      <Tab.Screen 
        name="Admin" 
        component={AdminScreen}
        options={{ title: 'Admin' }}
      />
    </Tab.Navigator>
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
    backgroundColor: '#ff3b30',
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

export default MainNavigator;

