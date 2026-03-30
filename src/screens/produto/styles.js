import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
    background: '#F2F4F7',
    white: '#FFFFFF',
    primary: '#2A7CC7',
    textDark: '#1E293B',
    textGray: '#64748B',
    success: '#059669',
    danger: '#EF4444',
    border: '#E2E8F0',
    cardPromoBg: '#FEF2F2'
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
        fontWeight: '800',
        color: COLORS.textDark,
        marginBottom: 6,
        lineHeight: 26,
    },
    produtoMarcaWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 4
    },
    produtoMarca: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        overflow: 'hidden',
        marginRight: 6,
        marginBottom: 4,
    },
    produtoCategoria: {
        fontSize: 14,
        color: COLORS.textGray,
        marginTop: 2,
    },

    // --- Títulos ---
    secaoTitulo: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textDark,
        marginBottom: 12,
        marginTop: 8,
    },

    // --- Conteúdo/Descrição ---
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
        lineHeight: 24,
        textAlign: 'justify',
    },

    // --- Lista de Farmácias ---
    farmaciasContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },

    // --- CARD DA FARMÁCIA ---
    farmaciaCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#2A7CC7",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        position: 'relative',
    },
    farmaciaCardEmPromocao: {
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
        backgroundColor: COLORS.danger,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderTopRightRadius: 14,
        borderBottomLeftRadius: 12,
        zIndex: 10,
    },
    promoBadgeTexto: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: 'bold',
    },
    farmaciaNome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 4,
        maxWidth: '85%',
    },
    farmaciaEndereco: {
        fontSize: 13,
        color: COLORS.textGray,
        marginBottom: 4,
    },
    farmaciaDistancia: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
        backgroundColor: '#F0F9FF',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 12,
        overflow: 'hidden',
    },

    // --- Área de Preço e Botões ---
    farmaciaInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 12,
        marginTop: 4,
    },
    farmaciaPrecoAntigo: {
        fontSize: 13,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
        marginBottom: -4,
    },
    farmaciaPreco: {
        fontSize: 22,
        fontWeight: '800',
        color: '#334155',
    },
    farmaciaPrecoPromocional: {
        fontSize: 24,
        fontWeight: '900',
        color: '#16A34A',
    },
    farmaciaAcoes: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    farmaciaBotao: {
        backgroundColor: '#EFF6FF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    farmaciaBotaoTexto: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
        marginLeft: 6,
    },
    // Botão de Reserva Principal
    botaoReservar: {
        backgroundColor: '#458B00', // Verde PharmaX
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        shadowColor: "#458B00",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    botaoReservarTexto: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 13
    },

    espacoFinal: {
        height: 60,
    },

    // --- MODAL DE RESERVA ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end', // Modal sobe de baixo
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    modalSubtitulo: {
        fontSize: 14,
        color: COLORS.textGray,
        marginBottom: 20,
    },
    // Controle de Quantidade
    qtdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        backgroundColor: '#F8FAFC',
        padding: 10,
        borderRadius: 16,
    },
    qtdBotao: {
        width: 44,
        height: 44,
        backgroundColor: '#FFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    qtdTexto: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginHorizontal: 24,
    },
    // Resumo de Preço
    resumoContainer: {
        backgroundColor: '#F0FDF4',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#BBF7D0',
    },
    resumoLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    resumoLabel: {
        fontSize: 14,
        color: '#166534',
    },
    resumoValor: {
        fontSize: 14,
        fontWeight: '600',
        color: '#166534',
    },
    resumoTotalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#14532D',
    },
    resumoTotalValor: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#16A34A',
    },
    // Botão Confirmar
    btnConfirmarReserva: {
        backgroundColor: '#458B00',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        shadowColor: "#458B00",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    btnConfirmarTexto: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    }
});