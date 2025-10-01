import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE9E9',
  },
  header: {
    backgroundColor: '#2A7CC7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  placeholder: {
    width: 30,
  },
  content: {
    flex: 1,
    marginBottom: 60,
  },
  produtoHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  produtoImagemContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#EEE9E9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  produtoImagem: {
    width: 80,
    height: 80,
  },
  produtoInfoBasica: {
    flex: 1,
    justifyContent: 'center',
  },
  produtoNome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2c3e50',
  },
  produtoMarca: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  produtoCategoria: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  quantidadeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginTop: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE9E9',
  },
  quantidadeTitulo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  quantidadeControles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantidadeBotao: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantidadeBotaoTexto: {
    color: '#EEE9E9',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantidadeValor: {
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  descricaoContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    marginTop: 30,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  descricaoTexto: {
    fontSize: 14,
    lineHeight: 20,
    color: '#34495e',
  },
  farmaciasContainer: {
    padding: 16,
    backgroundColor: '#EEE9E9',
    marginTop: 10,
  },
  farmaciaCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  farmaciaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2c3e50',
  },
  farmaciaEndereco: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  farmaciaDistancia: {
    fontSize: 12,
    color: '#3498db',
    marginBottom: 12,
  },
  farmaciaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  farmaciaPreco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 4,
  },
  farmaciaQuantidade: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  farmaciaAcoes: {
    alignItems: 'flex-end',
  },
  farmaciaBotao: {
    backgroundColor: '#3498db',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 6,
  },
  farmaciaBotaoTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  espacoFinal: {
    height: 20,
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#999',
  },
  tabText: {
    fontSize: 12,
    color: '#999',
  },
  tabActive: {
    color: '#2A7CC7',
  },
});