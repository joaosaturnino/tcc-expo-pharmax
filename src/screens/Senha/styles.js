import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    header: {
        width: '100%',
        marginBottom: 30,
        marginTop: 10,
        alignItems: 'center', // Centraliza o texto, mas o botão back ficará à esquerda via alignSelf
    },
    backButton: {
        alignSelf: 'flex-start', // Joga a seta para a esquerda
        marginBottom: 10,
        padding: 5,
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
        marginBottom: 20, // Reduzi um pouco para caber melhor
        fontSize: 16,
        color: '#2c3e50',
        // Sombra
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    recuperarButton: {
        backgroundColor: '#66CD00',
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
    buttonDisabled: {
        backgroundColor: '#9bd675',
        elevation: 0,
    },
    recuperarButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linksContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    link: {
        color: '#66CD00',
        fontSize: 16,
        marginVertical: 8,
        fontWeight: '500',
    },
});