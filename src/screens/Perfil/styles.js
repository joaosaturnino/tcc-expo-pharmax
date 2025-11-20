import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa', // Fundo claro padrão
    },
    scrollContainer: {
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 10,
        color: '#7f8c8d',
        fontSize: 16,
    },
    header: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50', // Azul escuro elegante
    },
    profileContainer: {
        alignItems: 'center',
    },
    // Wrapper do avatar
    photoWrapper: {
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    // O círculo cinza que representa o avatar
    profilePhotoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60, // Metade da largura/altura para ser um círculo perfeito
        backgroundColor: '#bdc3c7',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff', // Borda branca para destacar do fundo
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 5,
        fontWeight: '600',
        marginLeft: 4,
        textTransform: 'uppercase', // Texto em caixa alta para estilo de "rótulo"
    },
    // Estilo quando NÃO está editando (Fundo cinza, parece travado)
    inputReadonly: {
        backgroundColor: '#e9ecef',
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        fontSize: 16,
        color: '#495057',
    },
    // Estilo quando ESTÁ editando (Fundo branco, borda colorida)
    inputEditing: {
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#66CD00', // Verde destaque
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        fontSize: 16,
        color: '#2c3e50',
    },
    buttonsContainer: {
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#2A7CC7', // Azul padrão do sistema
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 15,
        // Sombras
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    saveButton: {
        backgroundColor: '#66CD00', // Verde sucesso
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    logoutButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e74c3c', // Vermelho alerta
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutText: {
        color: '#e74c3c',
        fontSize: 16,
        fontWeight: 'bold',
    },
});