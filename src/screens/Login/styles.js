import { StyleSheet, Dimensions } from 'react-native';

// Pega a largura total da tela do dispositivo atual
const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1, // Ocupa a tela toda
        backgroundColor: '#f8f9fa', // Fundo cinza claro (clean)
    },
    scrollContainer: {
        flexGrow: 1, // Permite que o ScrollView cresça para ocupar espaço
        justifyContent: 'center', // Centraliza tudo verticalmente
        paddingHorizontal: 20, // Espaço nas laterais
        paddingVertical: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        // Lógica Responsiva:
        // A logo ocupará 70% da largura da tela, independente do celular
        width: width * 0.7,
        height: width * 0.4, // Mantém uma proporção retangular
        marginBottom: 10,
    },
    // Títulos (não usados no JSX atual, mas úteis manter)
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8, // Bordas arredondadas suaves
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
        fontSize: 16,
        color: '#2c3e50',
        // Configuração de Sombra (iOS)
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        // Configuração de Sombra (Android)
        elevation: 2,
    },
    loginButton: {
        backgroundColor: '#66CD00', // Verde do tema PharmaX
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
        // Sombra mais forte para destacar o botão
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linksContainer: {
        marginTop: 25,
        alignItems: 'center',
    },
    link: {
        color: '#66CD00', // Link verde combinando com botão
        fontSize: 15,
        marginVertical: 5,
        fontWeight: '500',
    },
});