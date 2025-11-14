import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE9E9',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
    },
    profileContainer: {
        alignItems: 'center',
    },
    photoContainer: {
        marginBottom: 30,
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoText: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
    },
    form: {
        width: '100%',
        maxWidth: 400,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    // Adicionei este estilo para quando estiver editando (se desejar)
    inputEditing: { 
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#66CD00', // Borda verde para indicar edição
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    buttons: {
        marginTop: 20,
    },
    editButton: {
        backgroundColor: '#66CD00',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#66CD00',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    // Estilo para o botão de salvar desabilitado
    saveButtonDisabled: {
        backgroundColor: '#A5D6A7', // Verde mais claro
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    // NOVO ESTILO ADICIONADO
    logoutButton: {
        backgroundColor: '#E53935', // Vermelho para "sair"
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10, // Espaço entre os botões
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});