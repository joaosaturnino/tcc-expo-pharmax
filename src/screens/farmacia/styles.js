import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F4F7',
    },
    // --- HEADER / BANNER ---
    bannerGrandeContainer: {
        height: 200,
        position: 'relative',
        backgroundColor: '#fff',
    },
    bannerGrandeImagem: {
        width: '100%',
        height: '100%',
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    perfilContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    perfilImagemWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        // Sombra
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        marginBottom: 8,
    },
    perfilImagem: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#fff',
    },
    favoritosContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginTop: 4,
    },
    favoritosText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        marginLeft: 6,
    },

    // --- INFO CARD ---
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 0,
        // Sombra leve
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    infoTexts: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 15,
        color: '#334155',
        lineHeight: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 12,
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    contactValue: {
        fontSize: 14,
        color: '#334155',
        fontWeight: '500',
    },

    // --- CONTADOR E LISTA ---
    contadorContainer: {
        padding: 16,
        marginTop: 10,
        paddingBottom: 8, // Ajuste fino
    },
    contadorText: {
        fontSize: 14,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    medicamentosList: {
        paddingHorizontal: 16,
        paddingBottom: 40, // Espaço extra no final da lista
    },

    // --- CARD MEDICAMENTO ---
    medicamentoCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        // Sombra
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,

        position: 'relative',
        borderWidth: 2,
        borderColor: 'transparent', // Borda transparente por padrão
        overflow: 'visible', // Mudado para visible para o badge funcionar melhor se sair da borda
    },
    medicamentoCardEmPromocao: {
        backgroundColor: '#FEF2F2', // Fundo vermelho bem claro
        borderColor: '#FECACA',     // Borda vermelha clara
        borderWidth: 1.5,           // Borda um pouco mais grossa
        shadowColor: "#EF4444",     // Sombra avermelhada
        elevation: 6,
    },
    medicamentoImagem: {
        width: 60,
        height: 60,
        backgroundColor: '#f1f2f6',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    medicamentoImagemReal: {
        width: 50,
        height: 50,
        borderRadius: 6,
    },
    medicamentoInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    medicamentoNome: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 4,
    },
    medicamentoCategoria: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 6,
    },
    medicamentoPreco: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#27ae60',
    },
    medicamentoPrecoAntigo: {
        fontSize: 14,
        color: '#7f8c8d',
        textDecorationLine: 'line-through',
    },

    // --- BADGE PROMOÇÃO ---
    promoBadge: {
        position: 'absolute',
        top: -2, // Ajuste fino para colar na borda
        right: -2,
        backgroundColor: '#e74c3c',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        zIndex: 10,
    },
    promoBadgeTexto: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },

    // --- EMPTY STATE ---
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        marginTop: 16,
    },
    medicamentoImagemTexto: {
        fontSize: 40, // Tamanho do emoji
    }
});

export default styles;