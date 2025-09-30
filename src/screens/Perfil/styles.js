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
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});