import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F4F7', // Fundo cinza claro moderno
    },
    // --- BANNER E PERFIL ---
    bannerGrandeContainer: {
        height: 180, // Altura do banner
        position: 'relative',
        backgroundColor: '#fff',
    },
    bannerGrandeImagem: {
        width: '100%',
        height: '100%',
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)', // Escurece a imagem para o texto brilhar
    },
    perfilContainer: {
        position: 'absolute',
        bottom: -30, // Faz o logo "vazar" para baixo do banner (efeito visual)
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    perfilImagemWrapper: {
        width: 90,
        height: 90,
        backgroundColor: '#fff',
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        // Sombra do logo
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        borderWidth: 4,
        borderColor: '#fff',
    },
    perfilImagem: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    favoritosContainer: {
        marginTop: 4,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    favoritosText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        textAlign: 'center',
    },

    // --- CARD DE INFORMAÇÕES (Endereço/Tel) ---
    infoCard: {
        marginTop: 45, // Margem superior para compensar o logo que vazou
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        marginBottom: 16,
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

    // --- CONTADOR ---
    contadorContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    contadorText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },

    // --- LISTA DE MEDICAMENTOS ---
    medicamentosList: {
        paddingHorizontal: 16,
        paddingBottom: 20, // Espaço no final da rolagem
    },
    medicamentoCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        // Sombra suave
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'transparent',
        position: 'relative', // Necessário para o badge funcionar
    },
    medicamentoCardEmPromocao: {
        backgroundColor: '#FEF2F2', // Fundo vermelho bem claro
        borderColor: '#FECACA',     // Borda vermelha clara
        borderWidth: 1.5,           // Borda um pouco mais grossa
        shadowColor: "#EF4444",     // Sombra avermelhada
        elevation: 6,
    },
    medicamentoImagem: {
        width: 70,
        height: 70,
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    medicamentoImagemReal: {
        width: 60,
        height: 60,
    },
    medicamentoImagemTexto: {
        fontSize: 40,
        marginBottom: 10,
    },
    medicamentoInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    medicamentoNome: {
        fontSize: 16,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 4,
    },
    medicamentoCategoria: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 6,
    },
    medicamentoPreco: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#334155',
    },
    medicamentoPrecoAntigo: {
        fontSize: 13,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
    },

    // --- BADGE PROMOÇÃO ---
    promoBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 8,
        zIndex: 1,
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
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 16,
    },
    espacoFinal: {
        height: 20,
    },
});

export default styles;