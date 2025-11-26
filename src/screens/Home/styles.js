import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },

    // --- HEADER E LOGO ---
    header: {
        paddingTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: '#F5F7FA',
        alignItems: 'center',
    },
    logo: {
        width: 180,
        height: 80,
        resizeMode: 'contain',
    },

    // --- BARRA DE PESQUISA ---
    searchContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#F5F7FA',
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
        fontSize: 15,
        color: '#2c3e50',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    // --- SEÇÕES ---
    section: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
    },
    verTudo: {
        fontSize: 14,
        color: '#2A7CC7',
        fontWeight: '600',
    },

    // --- LISTA DE CATEGORIAS ---
    categoriasList: {
        paddingBottom: 10,
        paddingRight: 16,
    },
    categoriaItem: {
        alignItems: 'center',
        marginRight: 16,
        width: 72,
    },
    categoriaIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    categoriaNome: {
        fontSize: 11,
        color: '#475569',
        textAlign: 'center',
        fontWeight: '500',
    },

    // --- LISTA DE PRODUTOS ---
    produtosList: {
        paddingBottom: 15,
        paddingRight: 16,
    },
    produtoCard: {
        width: 150,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        position: 'relative',
    },

    // --- ALTERAÇÃO AQUI: ESTILO IGUAL AO DETALHES DO PRODUTO ---
    produtoImagem: {
        width: 100,
        height: 100,
        backgroundColor: '#F8FAFC', // Fundo cinza claro
        borderRadius: 16,           // <--- MUDANÇA: De 50 para 16 (Quadrado arredondado)
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        alignSelf: 'center',
    },
    produtoImagemReal: {
        width: '80%',               // Imagem interna um pouco menor
        height: '80%',
        resizeMode: 'contain',
    },
    // -----------------------------------------------------------

    produtoNome: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 4,
        height: 38,
    },
    produtoMarca: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 4,
    },
    produtoFarmacia: {
        fontSize: 11,
        color: '#2A7CC7',
        fontWeight: '500',
        marginBottom: 8,
    },
    produtoPreco: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#16a34a',
    },

    // --- PROMOÇÃO ---
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
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderTopRightRadius: 15,
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
        color: '#94a3b8',
        textDecorationLine: 'line-through',
        marginBottom: 2,
    },

    // --- LISTAS DE MARCAS E FARMÁCIAS ---
    marcasList: {
        paddingBottom: 15,
        paddingRight: 16,
    },

    // CARD DE LABORATÓRIO
    marcaCard: {
        alignItems: 'center',
        marginRight: 16,
        width: 90,
    },
    marcaLogo: {
        width: 80,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden', 
    },
    marcaLogoImagem: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
    },
    marcaNome: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '500',
        textAlign: 'center',
    },

    // CARD DE FARMÁCIA
    bannerFarmaciaCard: {
        width: 240,
        height: 140,
        marginRight: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
        paddingTop: 10, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        position: 'relative', 
    },
    
    // --- ESTILOS DO BADGE DE NOTA ---
    bannerFarmaciaBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#FFFBEB', 
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FCD34D', 
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bannerFarmaciaBadgeTexto: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#D97706',
    },

    bannerFarmaciaImagem: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f8fafc',
        alignSelf: 'center',
    },
    bannerFarmaciaNome: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        textAlign: 'center',
        paddingVertical: 10,
        backgroundColor: 'transparent',
    },

    espacoFinal: {
        height: 60,
    },
});