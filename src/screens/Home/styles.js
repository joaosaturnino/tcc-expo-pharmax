import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
    },
    searchContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchInput: {
        backgroundColor: '#f1f2f6',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        fontSize: 16,
        color: '#2c3e50',
    },
    section: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    verTudo: {
        fontSize: 14,
        color: '#3498db',
        fontWeight: '500',
    },
    categoriasList: {
        paddingBottom: 10,
    },
    categoriaItem: {
        alignItems: 'center',
        marginRight: 20,
        width: 80,
    },
    categoriaIcon: {
        fontSize: 30,
        marginBottom: 8,
    },
    categoriaNome: {
        fontSize: 12,
        color: '#2c3e50',
        textAlign: 'center',
        fontWeight: '500',
    },
    produtosList: {
        paddingBottom: 15,
    },
    produtoCard: {
        width: 140,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    produtoImagem: {
        width: 60,
        height: 60,
        backgroundColor: '#f1f2f6',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10,
    },
    produtoImagemTexto: {
        fontSize: 24,
    },
    produtoNome: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 4,
    },
    produtoMarca: {
        fontSize: 12,
        color: '#7f8c8d',
        marginBottom: 6,
    },
    produtoPreco: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#27ae60',
    },
    marcasList: {
        paddingBottom: 15,
    },
    marcaCard: {
        alignItems: 'center',
        marginRight: 20,
        width: 80,
    },
    marcaLogo: {
        width: 60,
        height: 60,
        backgroundColor: '#3498db',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    marcaLogoTexto: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    marcaNome: {
        fontSize: 12,
        color: '#2c3e50',
        fontWeight: '500',
        textAlign: 'center',
    },
    espacoFinal: {
        height: 30,
    },
    categoriaIcon: {
        width: 48,
        height: 48,
    },
});