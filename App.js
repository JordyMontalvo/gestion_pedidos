import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { PedidosProvider } from './src/context/PedidosContext';
import MainNavigator from './src/navigation/MainNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { ROLES } from './src/context/AuthContext';

// Componente que decide qué mostrar según el rol
const AppContent = () => {
  const { rol, cargando } = useAuth();

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  if (!rol) {
    return <LoginScreen />;
  }

  return <MainNavigator />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PedidosProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AppContent />
          </NavigationContainer>
        </PedidosProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});

