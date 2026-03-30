import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    // --- MUDANÇA AQUI: Verde mais escuro para dar contraste com o texto branco ---
    headerBackground: {
        backgroundColor: '#458B00', // Verde PharmaX (Escuro)
        height: 180,
        width: '100%',
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 0,
        position: 'absolute',
        top: 0,
        zIndex: -1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 30,
        width: '100%',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)', // Levemente transparente
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000000', // Preto puro
        marginBottom: 5,
        // Sombra leve no texto para destacar ainda mais
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#000000', // Preto puro
        fontWeight: '500',
    },
    
    // Formulário (Mantido igual, pois estava bom)
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 55,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        height: '100%',
    },
    btnEye: {
        padding: 5,
    },
    cadastroButton: {
        backgroundColor: '#458B00', // Atualizado para combinar com o topo
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#458B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    buttonDisabled: {
        backgroundColor: '#8BC34A',
        elevation: 0,
    },
    cadastroButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    linksContainer: {
        marginTop: 25,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    linkText: {
        color: '#7f8c8d',
        fontSize: 15,
    },
    linkBold: {
        color: '#458B00', // Atualizado
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 5,
    },
});