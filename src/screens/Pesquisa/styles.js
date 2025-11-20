import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
// Calcula largura do card para caber 2 por linha com margens
const cardWidth = (width / 2) - 24;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    // Header fixo no topo
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
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 16,
        top: 50,
        bottom: 12,
        justifyContent: 'center',
        zIndex: 10,
        width: 40,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2c3e50',
    },
    // Área do Input
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

    // --- CARD HORIZONTAL (FARMÁCIA/LAB) ---
    entidadeCard: {
        width: 140,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginRight: 12,
        alignItems: 'center',
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
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#f1f2f6',
    },
    entidadeImagem: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    entidadeNome: {
        fontSize: 13,
        fontWeight: '700',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 2,
    },
    entidadeTipo: {
        fontSize: 11,
        color: '#95a5a6',
        fontWeight: '500',
    },

    // --- GRID DE MEDICAMENTOS ---
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
        position: 'relative',
    },

    // --- CORREÇÃO AQUI: MUDADO PARA VERMELHO ---
    produtoCardEmPromocao: {
        backgroundColor: '#FEF2F2', // Fundo vermelho bem claro
        borderColor: '#FECACA',     // Borda vermelha clara
        borderWidth: 1.5,           // Borda um pouco mais grossa
        shadowColor: "#EF4444",     // Sombra avermelhada
        elevation: 6,
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
        backgroundColor: '#EF4444', // Vermelho forte para a etiqueta
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

    // --- ESTADO VAZIO ---
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