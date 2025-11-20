import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Cálculo dinâmico da largura do card para 2 colunas
// (Largura total / 2) - (margens laterais)
const cardWidth = (width / 2) - 24;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA', // Cor de fundo levemente acinzentada/moderna
    },
    header: {
        paddingTop: 60, // Espaço seguro para StatusBar
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#F5F7FA',
        // Removemos a borda inferior para um visual mais limpo "Clean"
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        textAlign: 'left', // Título alinhado à esquerda é mais moderno
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'left',
        marginTop: 4,
    },
    listaContainer: {
        paddingHorizontal: 12,
        paddingTop: 10,
    },

    // --- CARD DO PRODUTO ---
    produtoCard: {
        width: cardWidth,
        backgroundColor: 'white',
        borderRadius: 16, // Bordas mais arredondadas
        padding: 12,
        marginBottom: 16,
        marginHorizontal: 6, // Espaçamento entre colunas

        // Sombra suave (iOS e Android)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,

        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9', // Borda muito sutil
        overflow: 'hidden', // Garante que o botão de remover não saia do card
        position: 'relative',
    },
    produtoImagemContainer: {
        width: '100%',
        height: 110,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 10, // Espaço para não colar no botão remover
    },
    produtoImagem: {
        width: 90,
        height: 90,
    },
    produtoInfo: {
        width: '100%',
        alignItems: 'flex-start', // Alinha texto à esquerda
    },
    produtoNome: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 4,
        textAlign: 'left',
        height: 40, // Altura fixa para alinhar cards vizinhos
    },
    produtoMarca: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 2,
        textAlign: 'left',
    },
    produtoDosagem: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 6,
        textAlign: 'left',
    },

    // --- BOTÃO DE REMOVER ---
    removerButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#EF4444', // Vermelho alerta
        width: 36, // Área de toque maior
        height: 34,
        borderTopLeftRadius: 16, // Acompanha a borda do card
        borderBottomRightRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Garante que fica por cima da imagem
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
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 12,
        zIndex: 10,
    },
    promoBadgeTexto: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },

    // --- EMPTY STATE (Vazio) ---
    vazioContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 50,
    },
    vazioIcon: {
        fontSize: 60,
        marginBottom: 16,
        opacity: 0.8,
    },
    vazioTexto: {
        fontSize: 18,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
        textAlign: 'center',
    },
    vazioSubtexto: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 20,
    },
    espacoFinal: {
        height: 40, // Espaço extra no final da lista para scroll
    },
});