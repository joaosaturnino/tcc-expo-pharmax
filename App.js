import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import Navegacao from './src/routes';

// IMPORTANTE: O caminho deve apontar para onde você criou o arquivo do contexto
import { ReservaProvider } from './src/contexts/ReservaContext'; 

export default function App() {
  return (
    // Envolvemos a navegação com o Provider para que o badge funcione em todo o app
    <ReservaProvider>
      <Navegacao />
      <StatusBar style="auto" />
    </ReservaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee9e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});