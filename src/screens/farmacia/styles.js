import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE9E9',
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
        borderWidth: 0,
    },
    perfilImagem: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    favoritosContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    favoritosText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        marginLeft: 6,
    },
    // Contador
    contadorContainer: {
        padding: 16,
        backgroundColor: '#EEE9E9',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    contadorText: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    // Lista de medicamentos
    medicamentosList: {
        padding: 16,
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
        // --- CORREÇÕES AQUI ---
        position: 'relative', // Necessário para o Badge
        borderWidth: 2,
        borderColor: '#fff', // Borda padrão
        overflow: 'hidden', // Para o Badge
        // ----------------------
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
        color: '#27ae60', // Verde
    },

    // --- CORREÇÃO: NOVOS ESTILOS DE PROMOÇÃO ---
    medicamentoCardEmPromocao: {
        backgroundColor: '#fffbeb',
        borderColor: '#e74c3c', // Borda vermelha
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
        fontSize: 14, // Tamanho menor
        color: '#7f8c8d',
        textDecorationLine: 'line-through', // Riscado
    },
    // ------------------------------------------

    // Estados vazios
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
    // Espaço final
    espacoFinal: {
        height: 20,
    },
});

export default styles;