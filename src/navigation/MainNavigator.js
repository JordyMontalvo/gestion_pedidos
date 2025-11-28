import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePedidos } from '../context/PedidosContext';
import { useAuth, ROLES, NOMBRES_ROLES } from '../context/AuthContext';
import ProductosScreen from '../screens/ProductosScreen';
import CarritoScreen from '../screens/CarritoScreen';
import PedidosScreen from '../screens/PedidosScreen';
import CocinaScreen from '../screens/CocinaScreen';
import CajaScreen from '../screens/CajaScreen';
import PedidosBadge from '../components/PedidosBadge';

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
  const insets = useSafeAreaInsets();
  const { rol, cerrarSesion } = useAuth();
  const { pedidos } = usePedidos();
  
  // Contar pedidos pendientes para badge
  const pedidosPendientes = pedidos.filter(p => 
    p.estado === 'pendiente' || p.estado === 'en_preparacion'
  ).length;

  const handleCerrarSesion = () => {
    console.log('🔴 Botón de cerrar sesión presionado');
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            console.log('✅ Usuario confirmó cerrar sesión');
            try {
              await cerrarSesion();
              console.log('✅ Sesión cerrada, estado actualizado');
              // El cambio de rol hará que App.js muestre LoginScreen automáticamente
            } catch (error) {
              console.error('❌ Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar sesión. Intenta nuevamente.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Función para headerRight que React Navigation espera
  const headerRightComponent = () => (
    <TouchableOpacity
      onPress={handleCerrarSesion}
      style={styles.logoutButton}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="log-out-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Productos') {
            return <Ionicons name={focused ? 'restaurant' : 'restaurant-outline'} size={size} color={color} />;
          } else if (route.name === 'Carrito') {
            return <CarritoIconWithBadge color={color} size={size} />;
          } else if (route.name === 'Pedidos') {
            return <PedidosBadge cantidad={pedidosPendientes} color={color} size={size} />;
          } else if (route.name === 'Cocina') {
            return <Ionicons name={focused ? 'fast-food' : 'fast-food-outline'} size={size} color={color} />;
          } else if (route.name === 'Caja') {
            return <Ionicons name={focused ? 'cash' : 'cash-outline'} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#FF6B00',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e8e8e8',
          height: 60 + Math.max(insets.bottom, 8),
          paddingBottom: Math.max(insets.bottom, 8),
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
          marginBottom: Platform.OS === 'android' ? 0 : 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        headerStyle: {
          backgroundColor: '#FF6B00',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerStatusBarHeight: insets.top,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerShadowVisible: false,
      })}
    >
      {rol === ROLES.COCINA ? (
        <>
          <Tab.Screen 
            name="Cocina" 
            component={CocinaScreen}
            options={{ 
              title: '👨‍🍳 Cocina',
              headerRight: headerRightComponent,
            }}
          />
        </>
      ) : rol === ROLES.CAJA ? (
        <>
          <Tab.Screen 
            name="Caja" 
            component={CajaScreen}
            options={{ 
              title: '💰 Caja',
              headerRight: headerRightComponent,
            }}
          />
          <Tab.Screen 
            name="Pedidos" 
            component={PedidosScreen}
            options={{ 
              title: 'Todos los Pedidos',
              headerRight: headerRightComponent,
            }}
          />
        </>
      ) : rol === ROLES.MESERO ? (
        <>
          <Tab.Screen 
            name="Productos" 
            component={ProductosScreen}
            options={{ 
              title: 'Menú',
              headerRight: headerRightComponent,
            }}
          />
          <Tab.Screen 
            name="Carrito" 
            component={CarritoScreen}
            options={{ 
              title: 'Carrito',
              headerRight: headerRightComponent,
            }}
          />
          <Tab.Screen 
            name="Pedidos" 
            component={PedidosScreen}
            options={{ 
              title: 'Mis Pedidos',
              headerRight: headerRightComponent,
            }}
          />
        </>
      ) : (
        // Admin o por defecto - todas las pantallas
        <>
          <Tab.Screen 
            name="Productos" 
            component={ProductosScreen}
            options={{ 
              title: 'Menú',
              headerRight: headerRightComponent,
            }}
          />
          <Tab.Screen 
            name="Carrito" 
            component={CarritoScreen}
            options={{ 
              title: 'Carrito',
              headerRight: headerRightComponent,
            }}
          />
          <Tab.Screen 
            name="Pedidos" 
            component={PedidosScreen}
            options={{ 
              title: 'Pedidos',
              headerRight: headerRightComponent,
            }}
          />
        </>
      )}
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
  logoutButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainNavigator;
