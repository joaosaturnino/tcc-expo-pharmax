import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    vazioContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
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
        marginRight: 16,
        backgroundColor: '#f1f2f6',
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
    produtoLaboratorio: {
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
        backgroundColor: '#e74c3c',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    removerButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});