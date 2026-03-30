import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 20; // 2 colunas com margens equilibradas

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC', // Fundo cinza azulado muito claro
    },
    
    // --- HEADER ---
    header: {
        paddingTop: Platform.OS === 'android' ? 50 : 20,
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800', // Extra bold
        color: '#1E293B', // Azul escuro moderno
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 4,
        fontWeight: '500',
    },

    listaContainer: {
        paddingHorizontal: 12,
        paddingTop: 20,
        paddingBottom: 100, // Espaço para não cortar o último item
    },

    // --- CARD DO PRODUTO ---
    produtoCard: {
        width: cardWidth,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        marginHorizontal: 4, // Espaço entre colunas
        
        // Sombra suave estilo iOS
        shadowColor: "#64748B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4, // Sombra Android
        
        borderWidth: 1,
        borderColor: '#F1F5F9',
        position: 'relative',
    },
    
    // Área da Imagem
    produtoImagemContainer: {
        width: '100%',
        height: 100,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    produtoImagem: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },

    // Textos
    produtoInfo: {
        width: '100%',
    },
    produtoNome: {
        fontSize: 13,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 4,
        height: 36, // Altura fixa para 2 linhas
        lineHeight: 18,
    },
    produtoMarca: {
        fontSize: 11,
        color: '#94A3B8',
        marginBottom: 2,
        fontWeight: '600',
    },
    produtoDosagem: {
        fontSize: 11,
        color: '#64748B',
    },

    // --- BOTÃO DE REMOVER (Canto superior direito) ---
    removerButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FEF2F2', // Fundo vermelho bem claro
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },

    // --- PROMOÇÃO ---
    produtoCardEmPromocao: {
        borderColor: '#FECACA',
        backgroundColor: '#FFF1F2', // Fundo rosado sutil
    },
    promoBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#EF4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        zIndex: 10,
    },
    promoBadgeTexto: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    },

    // --- EMPTY STATE ---
    vazioContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: 80,
    },
    vazioIconBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    vazioTexto: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 8,
        textAlign: 'center',
    },
    vazioSubtexto: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
    },
    btnExplorar: {
        marginTop: 24,
        backgroundColor: '#458B00',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
    },
    btnExplorarText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },

    // --- SKELETON (Loading) ---
    skeletonCard: {
        width: cardWidth,
        height: 180,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        margin: 4,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
});