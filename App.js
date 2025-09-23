import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navegacao from './src/routes';
import { FavoritosProvider } from './src/screens/Favoritos/FavoritosContext';

export default function App() {
  return (
    <FavoritosProvider>
      <Navegacao />
      <StatusBar style="auto" />
    </FavoritosProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});