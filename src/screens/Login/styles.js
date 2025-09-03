import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#dcdde1',
        fontSize: 16,
    },

    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#66CD00',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    link: {
        marginTop: 10,
        color: '',
        fontSize: 16,
        textAlign: 'center',
    },

    logo: {
        width: 400,
        height: 200,
        marginTop: 100,      // Espaço do topo
        marginBottom: 100,   // Espaço abaixo da imagem
        alignSelf: 'center', // Corrige capitalização
    },

});