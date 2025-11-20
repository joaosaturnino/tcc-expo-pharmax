import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa', // Cor de fundo suave
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    // --- HEADER ---
    header: {
        width: '100%',
        marginBottom: 30,
        marginTop: 10,
        // Não usamos alignItems: 'center' aqui para permitir 
        // que o botão de voltar fique à esquerda
    },
    backButton: {
        alignSelf: 'flex-start', // Força o botão a ficar na esquerda
        marginBottom: 20,
        padding: 8, // Aumenta a área de toque
        borderRadius: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
    },

    // --- FORMULÁRIO ---
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
        marginBottom: 20,
        fontSize: 16,
        color: '#2c3e50',
        // Sombra suave para dar profundidade
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },

    // --- BOTÃO DE AÇÃO ---
    recuperarButton: {
        backgroundColor: '#66CD00', // Verde destaque
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    // Estilo visual quando o botão está carregando
    buttonDisabled: {
        backgroundColor: '#9bd675', // Verde mais claro
        elevation: 0,
    },
    recuperarButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});