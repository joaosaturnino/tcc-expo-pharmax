import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Cálculo da largura do card:
// (Largura da tela / 2 colunas) - (marginHorizontal * 2 + padding da lista / 2)
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
        marginBottom: 10, 
    },
    contadorText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },
    medicamentosList: {
        paddingHorizontal: 8,
        paddingBottom: 40, 
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
        borderWidth: 1, 
        borderColor: '#eee',
        overflow: 'hidden',
        position: 'relative', 
    },
    medicamentoImagem: {
        width: '100%', 
        height: 100,
        backgroundColor: '#f1f2f6',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        alignSelf: 'center',
    },
    medicamentoInfo: {
        flex: 1,
        justifyContent: 'space-between', 
    },
    medicamentoNome: {
        fontSize: 14, 
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 4,
        height: 40, // Altura fixa para manter alinhamento
    },
    medicamentoCategoria: {
        fontSize: 12,
        color: '#95a5a6',
        marginBottom: 4,
    },

    // --- NOVO ESTILO: NOME DA FARMÁCIA ---
    medicamentoFarmacia: {
        fontSize: 11,
        color: '#2A7CC7', // Azul do tema
        fontWeight: '500',
        marginBottom: 8,
    },
    // --------------------------------------

    medicamentoPreco: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#27ae60',
    },

    // --- ESTILOS DE PROMOÇÃO ---
    produtoCardEmPromocao: {
        backgroundColor: '#FEF2F2', 
        borderColor: '#FECACA',     
        borderWidth: 1.5,           
        shadowColor: "#EF4444",     
        elevation: 6,
    },
    promoBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#e74c3c',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderTopRightRadius: 14,
        borderBottomLeftRadius: 12,
        zIndex: 10,
    },
    promoBadgeTexto: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    produtoPrecoAntigo: {
        fontSize: 12,
        color: '#bdc3c7',
        textDecorationLine: 'line-through',
        marginBottom: 2,
    },

    // --- EMPTY STATE ---
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
        marginTop: 10,
    },
});