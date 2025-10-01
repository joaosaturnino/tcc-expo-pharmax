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
    // Botão Favoritar
    favoritarButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    favoritarIcon: {
        fontSize: 20,
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
        backgroundColor: '#fff',
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
        borderWidth: 3,
        borderColor: '#fff',
    },
    perfilImagem: {
        width: 60,
        height: 60,
        borderRadius: 30,
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