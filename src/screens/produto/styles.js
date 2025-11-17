import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        flex: 1,
    },
    // --- Header do Produto ---
    produtoHeader: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    produtoImagemContainer: {
        width: 120,
        height: 120,
        backgroundColor: '#f1f2f6',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    produtoImagem: {
        width: 100,
        height: 100,
    },
    produtoInfoBasica: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    produtoNome: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 4,
        flexShrink: 1,
    },
    produtoMarca: {
        fontSize: 15,
        color: '#7f8c8d',
        marginBottom: 2,
    },
    produtoCategoria: {
        fontSize: 15,
        color: '#7f8c8d',
    },

    // --- Conteúdo ---
    conteudoContainer: {
        padding: 16,
        backgroundColor: '#fff',
        marginTop: 8,
    },
    conteudoTexto: {
        fontSize: 16,
        color: '#34495e',
        lineHeight: 22,
    },

    // --- Descrição ---
    descricaoContainer: {
        padding: 16,
        backgroundColor: '#fff',
        marginTop: 8,
    },
    secaoTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    descricaoTexto: {
        fontSize: 15,
        color: '#34495e',
        lineHeight: 22,
    },

    // --- Lista de Farmácias ---
    farmaciasContainer: {
        padding: 16,
        marginTop: 8,
        backgroundColor: '#fff',
    },
    farmaciaCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee', // Borda padrão
        position: 'relative',
        overflow: 'hidden',
    },
    // --- CORREÇÃO: Estilo de Destaque ---
    farmaciaCardEmPromocao: {
        backgroundColor: '#fffbeb', // Fundo amarelo claro
        borderColor: '#e74c3c', // Borda vermelha
        borderWidth: 2, // Borda mais grossa
    },
    // ------------------------------------
    farmaciaNome: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    farmaciaEndereco: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 4,
    },
    farmaciaDistancia: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 2,
    },
    farmaciaInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
    },

    // --- Estilos de Preço e Promoção ---
    farmaciaPreco: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    farmaciaPrecoAntigo: {
        fontSize: 15,
        color: '#7f8c8d',
        textDecorationLine: 'line-through',
    },
    farmaciaPrecoPromocional: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#27ae60',
    },
    // --- CORREÇÃO: Badge Atualizado ---
    promoBadge: {
        position: 'absolute',
        top: -1,
        right: -1,
        backgroundColor: '#e74c3c', // Vermelho
        paddingHorizontal: 12, // Mais espaço para o texto
        paddingVertical: 4, // Mais espaço para o texto
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
    },
    promoBadgeTexto: {
        color: '#fff',
        fontSize: 12, // Fonte um pouco maior
        fontWeight: 'bold',
    },
    // ------------------------------------

    farmaciaQuantidade: {
        fontSize: 13,
        color: '#7f8c8d',
        marginTop: 2,
    },
    farmaciaAcoes: {
        flexDirection: 'row',
    },
    farmaciaBotao: {
        marginLeft: 10,
        backgroundColor: '#e9f3fd',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    farmaciaBotaoTexto: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2A7CC7',
    },

    // --- Espaço no Final ---
    espacoFinal: {
        height: 40,
    }
});