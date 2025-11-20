import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA', // Cor de fundo mais moderna e suave
    },

    // --- HEADER E LOGO ---
    header: {
        paddingTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: '#F5F7FA',
        alignItems: 'center', // Centraliza a logo horizontalmente
    },
    logo: {
        width: 180, // Reduzi um pouco para não ocupar tanto espaço da tela
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
        // Sombra leve na barra de pesquisa
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    // --- SEÇÕES (Categorias, Destaques, etc) ---
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
        color: '#2A7CC7', // Azul padrão de links
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
        borderRadius: 28, // Deixa redondinho
        backgroundColor: '#fff',
        marginBottom: 8,
        // Pequena borda para destacar do fundo
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
        // Sombra
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        position: 'relative',
    },

    produtoImagem: {
        width: '100%',
        height: 100,
        // backgroundColor: '#fff', // REMOVER ou COMENTAR esta linha para não ficar um quadrado branco atrás
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    produtoImagemReal: {
        width: 90,
        height: 90,
        borderRadius: 45, // ADICIONADO: Metade de 90 para ficar um círculo perfeito
    },
    // produtoImagem: {
    //     width: '100%',
    //     height: 100,
    //     backgroundColor: '#fff',
    //     borderRadius: 8,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginBottom: 10,
    // },
    // produtoImagemReal: {
    //     width: 90,
    //     height: 90,
    // },
    produtoNome: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 4,
        height: 38, // Altura fixa para alinhar textos longos
    },
    produtoMarca: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 8,
    },
    produtoPreco: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#16a34a', // Verde sucesso
    },

    // --- PROMOÇÃO ---
    produtoCardEmPromocao: {
        backgroundColor: '#FEF2F2', // Fundo vermelho bem claro
        borderColor: '#FECACA',     // Borda vermelha clara
        borderWidth: 1.5,           // Borda um pouco mais grossa
        shadowColor: "#EF4444",     // Sombra avermelhada
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
        borderRadius: 40, // Mantém o container perfeitamente redondo
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        // Sombra suave
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        // ADICIONADO: Garante que a imagem não vase pelos cantos se for grande
        overflow: 'hidden', 
    },
    marcaLogoImagem: {
        width: 55, // Ajuste leve de tamanho (era 50) para preencher melhor
        height: 55,
        borderRadius: 27.5, // ADICIONADO: Deixa a própria imagem redonda
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
        // Adicionei padding para organizar melhor o conteúdo centralizado
        paddingTop: 10, 
        
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    bannerFarmaciaImagem: {
        width: 80,         // ALTERADO: De '100%' para tamanho fixo
        height: 80,        // ALTERADO: Tamanho quadrado
        borderRadius: 40,  // ADICIONADO: Metade da largura para ficar redonda
        backgroundColor: '#f8fafc',
        alignSelf: 'center', // ADICIONADO: Centraliza a imagem no card
    },
    bannerFarmaciaNome: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        textAlign: 'center',
        paddingVertical: 10,
        backgroundColor: 'transparent', // ALTERADO: Para não cobrir nada
    },

    espacoFinal: {
        height: 60, // Espaço extra no final da rolagem
    },
});