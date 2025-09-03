import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';

export default function CadUsuario() {
    const navigation = useNavigation();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    function handleCadastro() {
        // Validações básicas
        if (!nome || !email || !telefone || !senha || !confirmarSenha) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        if (senha.length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        // Simulação de cadastro bem-sucedido
        Alert.alert(
            'Sucesso',
            'Cadastro realizado com sucesso!',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.goBack();
                    }
                }
            ]
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Cadastro de Usuario</Text>
                    <Text style={styles.subtitle}>Crie sua conta para acessar o sistema</Text>
                </View>

                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Nome completo'
                        placeholderTextColor="#999"
                        value={nome}
                        onChangeText={setNome}
                        autoCapitalize="words"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder='E-mail'
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder='Telefone'
                        placeholderTextColor="#999"
                        value={telefone}
                        onChangeText={setTelefone}
                        keyboardType="phone-pad"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder='Senha'
                        placeholderTextColor="#999"
                        value={senha}
                        secureTextEntry
                        onChangeText={setSenha}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder='Confirmar senha'
                        placeholderTextColor="#999"
                        value={confirmarSenha}
                        secureTextEntry
                        onChangeText={setConfirmarSenha}
                    />

                    <TouchableOpacity style={styles.cadastroButton} onPress={handleCadastro}>
                        <Text style={styles.cadastroButtonText}>Cadastrar</Text>
                    </TouchableOpacity>

                    <View style={styles.linksContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.link}>Já tem uma conta? Faça login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}