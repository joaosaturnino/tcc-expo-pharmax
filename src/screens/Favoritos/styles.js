import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE9E9',
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 10,
        paddingBottom: 15,
        backgroundColor: '#EEE9E9',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 27,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#7f8c8d',
        textAlign: 'center',
        marginTop: 5,
    },
    listaContainer: {
        padding: 16,
    },
    produtoCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        alignItems: 'center',
    },
    produtoImagem: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#f1f2f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    produtoInfo: {
        flex: 1,
    },
    produtoNome: {
        fontSize: 16,
        fontWeight: '600',
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
        color: '#458B00',
    },
    removerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e74c3c',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    removerIcon: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    vazioContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    vazioIcon: {
        fontSize: 50,
        marginBottom: 20,
    },
    vazioTexto: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 8,
        textAlign: 'center',
    },
    vazioSubtexto: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        lineHeight: 22,
    },
    espacoFinal: {
        height: 20,
    },
});