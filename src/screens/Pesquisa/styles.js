import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const spacing = 16;
// Ajuste do card para acomodar o espaçamento
const cardWidth = (width - (spacing * 2) - 12) / 2; 

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    
    // --- HEADER ---
    headerContainer: {
        paddingTop: Platform.OS === 'android' ? 40 : 60,
        paddingHorizontal: spacing,
        paddingBottom: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 100,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        letterSpacing: -0.5,
    },
    
    // --- BUSCA ---
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 50,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#334155',
        marginLeft: 10,
        height: '100%',
    },
    clearButton: {
        padding: 8,
    },

    // --- FILTROS ---
    filterScrollView: {
        maxHeight: 60,
        backgroundColor: '#fff',
        paddingBottom: 10,
    },
    filterContentContainer: {
        paddingHorizontal: spacing,
        paddingVertical: 8,
    },
    filterButton: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 25,
        backgroundColor: '#F1F5F9',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: '#2A7CC7',
        shadowColor: '#2A7CC7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: '700',
    },

    // --- CONTEÚDO ---
    scrollContent: {
        paddingTop: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
    },
    sectionBadge: {
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    sectionBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0284C7',
    },

    // --- CARD ENTIDADE (FARMÁCIA/LAB) ---
    entidadeCard: {
        width: 130,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginRight: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    // IMAGEM REDONDA: Container
    entidadeImagemContainer: {
        width: 80,             // Tamanho
        height: 80,            // Tamanho igual
        borderRadius: 40,      // Metade do tamanho (80 / 2 = 40)
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F8FAFC',
        overflow: 'hidden',    // Garante que a imagem não saia do círculo
    },
    // IMAGEM REDONDA: Imagem interna
    entidadeImagem: {
        width: '100%',
        height: '100%',
        borderRadius: 40,      // Força o arredondamento na imagem também
    },
    entidadeNome: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
        textAlign: 'center',
        marginBottom: 4,
    },
    entidadeTipo: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '500',
        textTransform: 'uppercase',
    },

    // --- CARD MEDICAMENTO ---
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: spacing,
        justifyContent: 'space-between',
    },
    produtoCard: {
        width: cardWidth,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F8FAFC',
    },
    produtoCardEmPromocao: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FCA5A5',
        shadowColor: "#EF4444",
        elevation: 4,
    },
    
    // --- ALTERAÇÃO AQUI (Estilo Quadrado Arredondado) ---
    produtoImagem: {
        width: 100,            
        height: 100,           
        borderRadius: 16,      // <--- MUDANÇA: De 50 para 16
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        overflow: 'hidden',    
    },
    produtoImagemReal: {
        width: '80%',          // <--- MUDANÇA: De 65% para 80%
        height: '80%',
        resizeMode: 'contain', 
    },
    // ----------------------------------------------------
    
    produtoNome: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 4,
        textAlign: 'center',
        lineHeight: 20,
    },
    produtoMarca: {
        fontSize: 12,
        color: '#94A3B8',
        marginBottom: 4, 
        textAlign: 'center',
    },
    produtoFarmacia: {
        fontSize: 11,
        color: '#2A7CC7', 
        fontWeight: '500',
        marginBottom: 8,
        textAlign: 'center', 
    },
    priceTag: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    produtoPreco: {
        fontSize: 16,
        fontWeight: '800',
        color: '#10B981',
    },
    produtoPrecoAntigo: {
        fontSize: 12,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
        marginBottom: 2,
    },
    promoBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        zIndex: 1,
    },
    promoBadgeTexto: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
    },

    // --- EMPTY STATES ---
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 40,
        opacity: 0.7,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: 16,
        color: '#CBD5E1',
    },
    emptyText: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        fontWeight: '500',
    },
});