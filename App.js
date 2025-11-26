import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { PedidosProvider } from './src/context/PedidosContext';
import MainNavigator from './src/navigation/MainNavigator';

export default function App() {
  return (
    <PedidosProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <MainNavigator />
      </NavigationContainer>
    </PedidosProvider>
  );
}

