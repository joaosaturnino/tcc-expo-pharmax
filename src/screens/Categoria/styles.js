import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 24;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    contadorContainer: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    contadorText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },
    medicamentosList: {
        paddingHorizontal: 8,
        paddingTop: 16,
    },
    medicamentoCard: {
        width: cardWidth,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 12,
        marginHorizontal: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 2,
        borderColor: '#fff',
        overflow: 'hidden',
    },
    medicamentoImagem: {
        width: 100,
        height: 100,
        backgroundColor: '#f1f2f6',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        alignSelf: 'center',
    },
    medicamentoImagemTexto: {
        fontSize: 30,
    },
    medicamentoInfo: {
        flex: 1,
    },
    medicamentoNome: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 4,
    },
    medicamentoCategoria: {
        fontSize: 13,
        color: '#7f8c8d',
        marginBottom: 6,
    },
    medicamentoPreco: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#27ae60',
        marginTop: 'auto',
    },

    // --- ESTILOS DE PROMOÇÃO ---
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
    produtoPrecoAntigo: {
        fontSize: 13,
        color: '#7f8c8d',
        textDecorationLine: 'line-through',
        marginTop: 'auto',
    },
    // ---------------------------------

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    espacoFinal: {
        height: 40,
    },
});