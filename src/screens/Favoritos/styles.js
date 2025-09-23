import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2A7CC7',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  limparTexto: {
    color: 'white',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  listaContainer: {
    padding: 16,
  },
  produtoCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  produtoImagemContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  produtoImagem: {
    width: 50,
    height: 50,
  },
  produtoInfo: {
    flex: 1,
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  produtoMarca: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  produtoPreco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  removerButton: {
    padding: 8,
  },
  removerIcon: {
    fontSize: 20,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  vazioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  vazioIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  vazioTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  vazioSubtexto: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  botaoExplorar: {
    backgroundColor: '#2A7CC7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 15,
  },
  botaoExplorarTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  espacoFinal: {
    height: 20,
  },
});