import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Navegacao from './src/routes';

export default function App() {
  return (

    <Navegacao />
    // <StatusBar style="auto" />

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
