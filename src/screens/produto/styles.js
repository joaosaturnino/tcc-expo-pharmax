import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

// Paleta de cores para facilitar manutenção
const COLORS = {
    background: '#F2F4F7', // Cinza bem claro e moderno
    white: '#FFFFFF',
    primary: '#2A7CC7',    // Azul principal
    textDark: '#1E293B',   // Quase preto, mais suave
    textGray: '#64748B',   // Cinza médio
    success: '#059669',    // Verde para preços
    danger: '#EF4444',     // Vermelho para promoções
    border: '#E2E8F0',     // Bordas sutis
    cardPromoBg: '#FFF7ED' // Fundo laranja bem clarinho para promo
};

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
    },

    // --- Header do Produto ---
    produtoHeader: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        // Sombra suave
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 16,
    },
    produtoImagemContainer: {
        width: 110,
        height: 110,
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    produtoImagem: {
        width: 90,
        height: 90,
    },
    produtoInfoBasica: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    produtoNome: {
        fontSize: 20,
        fontWeight: '800', // Extra bold
        color: COLORS.textDark,
        marginBottom: 6,
        lineHeight: 26,
    },
    produtoMarca: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
        backgroundColor: '#E0F2FE', // Fundo azul claro
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start', // Ocupa apenas o tamanho do texto
        overflow: 'hidden',
        marginRight: 6,
        marginBottom: 4,
    },
    produtoCategoria: {
        fontSize: 14,
        color: COLORS.textGray,
        marginTop: 4,
    },

    // --- Títulos das Seções ---
    secaoTitulo: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textDark,
        marginBottom: 12,
        marginTop: 8,
    },

    // --- Conteúdo e Descrição (Estilo Card) ---
    conteudoContainer: {
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    conteudoTexto: {
        fontSize: 15,
        color: COLORS.textDark,
        fontWeight: '500',
    },
    descricaoContainer: {
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    descricaoTexto: {
        fontSize: 15,
        color: COLORS.textGray,
        lineHeight: 24, // Melhor leitura
        textAlign: 'justify',
    },

    // --- Lista de Farmácias ---
    farmaciasContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    
    // --- CARD FARMÁCIA ---
    farmaciaCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        // Sombra para destacar o card
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'transparent', // Padrão sem borda
    },
    
    // Estilo quando em promoção
    farmaciaCardEmPromocao: {
        backgroundColor: COLORS.cardPromoBg,
        borderColor: '#FDBA74', // Laranja suave
        borderWidth: 1,
    },

    // --- Badge de Promoção ---
    promoBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: COLORS.danger,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        zIndex: 10,
    },
    promoBadgeTexto: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: 'bold',
    },

    // --- Informações da Farmácia ---
    farmaciaNome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 4,
        maxWidth: '80%', // Para não ficar em cima do badge
    },
    farmaciaEndereco: {
        fontSize: 13,
        color: COLORS.textGray,
        marginBottom: 2,
    },
    farmaciaDistancia: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.primary,
        marginBottom: 12,
    },

    // --- Área de Preço e Ações ---
    farmaciaInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 12,
        marginTop: 8,
    },

    // Preços
    farmaciaPrecoAntigo: {
        fontSize: 14,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
        marginBottom: -2,
    },
    farmaciaPreco: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textDark, // Preço normal
    },
    farmaciaPrecoPromocional: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.success, // Verde chamativo
    },
    farmaciaQuantidade: {
        fontSize: 12,
        color: COLORS.textGray,
        marginTop: 4,
    },

    // Botões
    farmaciaAcoes: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // Espaço entre botões (funciona no RN mais novo)
    },
    farmaciaBotao: {
        backgroundColor: '#EFF6FF', // Azul bem claro
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DBEAFE',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    farmaciaBotaoTexto: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.primary,
    },

    // Espaço final para scroll
    espacoFinal: {
        height: 60,
    }
});