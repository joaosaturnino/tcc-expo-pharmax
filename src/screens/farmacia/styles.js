import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F4F7', // Fundo cinza claro para contraste
    },
    // Banner Grande
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
    // Perfil sobre o Banner
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
        backgroundColor: 'transparent',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
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
    
    // --- ESTILOS DO CARD DE INFORMAÇÕES (NOVO) ---
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16, // Espaço abaixo do banner
        marginBottom: 0,
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
    // ---------------------------------------------

    // Contador
    contadorContainer: {
        padding: 16,
        // backgroundColor: '#F2F4F7', // Removido para não conflitar visualmente
        marginTop: 10,
    },
    contadorText: {
        fontSize: 14,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    // Lista de medicamentos
    medicamentosList: {
        padding: 16,
        paddingTop: 0,
    },
    medicamentoCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        position: 'relative',
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
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
    medicamentoImagemTexto: {
        fontSize: 24,
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
    medicamentoCardEmPromocao: {
        backgroundColor: '#fffbeb',
        borderColor: '#e74c3c',
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
    medicamentoPrecoAntigo: {
        fontSize: 14,
        color: '#7f8c8d',
        textDecorationLine: 'line-through',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        marginTop: 16,
    },
    espacoFinal: {
        height: 20,
    },
});

export default styles;