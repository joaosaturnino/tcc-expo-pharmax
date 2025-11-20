import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa', // Cor de fundo cinza claro
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    header: {
        // Não usamos alignItems: 'center' aqui para permitir que o botão 
        // de voltar fique alinhado à esquerda naturalmente
        marginBottom: 30,
        width: '100%',
    },
    // Estilo do botão de voltar (ícone)
    backButton: {
        alignSelf: 'flex-start', // Garante que fique na esquerda
        marginBottom: 15,        // Espaço entre a seta e o título
        padding: 5,              // Aumenta a área clicável
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
        textAlign: 'center', // Centraliza apenas o texto
        alignSelf: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        alignSelf: 'center',
    },
    formContainer: {
        width: '100%',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
        fontSize: 16,
        color: '#2c3e50',
        // Sombra suave no Android e iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cadastroButton: {
        backgroundColor: '#66CD00', // Verde PharmaX
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
        // Sombra mais forte no botão
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    // Estilo visual quando está carregando
    buttonDisabled: {
        backgroundColor: '#9bd675', // Verde mais claro
        elevation: 0,
    },
    cadastroButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linksContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    link: {
        color: '#66CD00',
        fontSize: 16,
        marginVertical: 8,
        fontWeight: '500',
    },
});