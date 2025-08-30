import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import styles from './styles';

export default function EsqSenha({ navigation }) {
    const [email, setEmail] = useState('');

    function handleRecuperarSenha() {
        // Lógica para recuperar senha usando o e-mail
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Esqueci a senha</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleRecuperarSenha}
            >
                <Text style={styles.buttonText}>Recuperar Senha</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
}