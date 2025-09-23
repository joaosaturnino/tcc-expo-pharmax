import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  // ... seus estilos existentes ...

  favoritoButton: {
    padding: 5,
  },
  favoritoIcon: {
    fontSize: 24,
  },
  favoritoAtivo: {
    color: '#e74c3c',
  },

  // ... resto dos seus estilos ...
});