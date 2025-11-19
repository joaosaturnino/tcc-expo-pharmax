import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 24;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingTop: 50, 
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 16,
        top: 50, 
        bottom: 12,
        justifyContent: 'center',
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2c3e50',
    },
    searchContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#f1f2f6',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        paddingRight: 40,
        fontSize: 16,
        color: '#2c3e50',
    },
    clearButton: {
        position: 'absolute',
        right: 25,
        height: 50,
        justifyContent: 'center',
    },
    
    // --- SEÇÕES ---
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 12,
        paddingHorizontal: 16,
    },

    // --- CARD DE FARMÁCIA / LABORATÓRIO ---
    entidadeCard: {
        width: 140, // Largura fixa para lista horizontal
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginRight: 12, // Espaçamento horizontal entre cards
        alignItems: 'center',
        // Sombra
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    entidadeImagemContainer: {
        width: 80,
        height: 80,
        borderRadius: 40, // Circular
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#f1f2f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    entidadeImagem: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    entidadeNome: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 2,
    },
    entidadeTipo: {
        fontSize: 12,
        color: '#95a5a6',
        fontWeight: '500',
    },

    // --- CARD DE MEDICAMENTO ---
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 8,
    },
    produtoCard: {
        width: cardWidth,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 12,
        marginHorizontal: 8,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f2f6',
    },
    produtoCardEmPromocao: {
        backgroundColor: '#fffbeb',
        borderColor: '#e74c3c',
    },
    produtoImagem: {
        width: 100,
        height: 100,
        backgroundColor: '#f1f2f6',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    produtoImagemReal: {
        width: '100%',
        height: '100%',
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
        marginBottom: 6,
        textAlign: 'center',
    },
    produtoPreco: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#27ae60',
        textAlign: 'center',
    },
    produtoPrecoAntigo: {
        fontSize: 13,
        color: '#7f8c8d',
        textDecorationLine: 'line-through',
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
    
    // --- Empty State ---
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
    },
});