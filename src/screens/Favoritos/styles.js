import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 24; 

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
        paddingHorizontal: 8,
        paddingTop: 16,
    },
    produtoCard: {
        width: cardWidth,
        backgroundColor: 'white',
        borderRadius: 14,
        padding: 12,
        marginBottom: 16,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        overflow: 'hidden',
        position: 'relative',
    },
    produtoImagemContainer: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: '#f1f2f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    produtoImagem: {
        width: 90,
        height: 90,
    },
    produtoInfo: {
        flex: 1,
        alignItems: 'center',
    },
    produtoNome: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 4,
        textAlign: 'center',
    },
    produtoMarca: {
        fontSize: 13,
        color: '#7f8c8d',
        marginBottom: 4,
        textAlign: 'center',
    },
    produtoDosagem: {
        fontSize: 13,
        color: '#7f8c8d',
        marginBottom: 6,
        textAlign: 'center',
    },
    removerButton: {
        position: 'absolute',
        top: -1,
        left: -1,
        backgroundColor: '#e74c3c',
        width: 30,
        height: 30,
        borderRadius: 0,
        borderTopLeftRadius: 12,
        borderBottomRightRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    
    // --- ESTILOS DE PREÇO REMOVIDOS ---
    // produtoPreco (removido)
    // produtoPrecoAntigo (removido)
    // produtoSemPreco (removido)

    // --- ESTILOS DE PROMOÇÃO (Visuais) MANTIDOS ---
    produtoCardEmPromocao: {
        backgroundColor: '#fffbeb',
        borderColor: '#e74c3c',
    },
    promoBadge: {
        position: 'absolute',
        top: -1,
        right: -1,
        backgroundColor: '#e74c3c',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
        zIndex: 1,
    },
    promoBadgeTexto: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    // ------------------------------------------
    
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