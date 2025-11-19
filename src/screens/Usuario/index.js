import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput, 
    Alert, 
    KeyboardAvoidingView, 
    ScrollView, 
    Platform,
    ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Importação do ícone

import api from '../../services/api'; 
import styles from './styles';

export default function CadUsuario() {
    const navigation = useNavigation();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    // Trocamos Telefone por CPF
    const [cpf, setCpf] = useState(''); 
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    
    const [loading, setLoading] = useState(false);

    // Função para mascarar o CPF (000.000.000-00)
    const handleCpfChange = (text) => {
        // Remove tudo que não é número
        let value = text.replace(/\D/g, '');
        
        // Limita a 11 caracteres
        if (value.length > 11) value = value.slice(0, 11);

        // Aplica a máscara
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        setCpf(value);
    };

    async function handleCadastro() {
        // Validação
        if (!nome || !email || !cpf || !senha || !confirmarSenha) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
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
        
        // Validação simples de tamanho de CPF
        if (cpf.length < 14) {
            Alert.alert('Erro', 'CPF incompleto.');
            return;
        }

        setLoading(true);

        try {
            const dadosUsuario = {
                usu_nome: nome,
                usu_email: email,
                usu_cpf: cpf, // Agora enviamos o CPF
                usu_senha: senha
            };

            const response = await api.post('/usuarios', dadosUsuario);

            if (response.data.sucesso) {
                Alert.alert(
                    'Sucesso',
                    'Cadastro realizado com sucesso!',
                    [{ text: 'Fazer Login', onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert('Erro', response.data.mensagem || 'Não foi possível cadastrar.');
            }

        } catch (error) {
            console.error("Erro cadastro:", error);
            if (error.response) {
                Alert.alert('Erro', error.response.data.mensagem || 'Erro ao processar cadastro.');
            } else {
                Alert.alert('Erro de Conexão', 'Verifique sua internet e tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <View style={styles.header}>
                    

                    <Text style={styles.title}>Cadastro de Usuário</Text>
                    <Text style={styles.subtitle}>Preencha os dados para acessar o sistema</Text>
                </View>

                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Nome completo'
                        placeholderTextColor="#999"
                        value={nome}
                        onChangeText={setNome}
                        autoCapitalize="words"
                        returnKeyType="next"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder='E-mail'
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        returnKeyType="next"
                    />

                    {/* CAMPO DE CPF ADICIONADO */}
                    <TextInput
                        style={styles.input}
                        placeholder='CPF (000.000.000-00)'
                        placeholderTextColor="#999"
                        value={cpf}
                        onChangeText={handleCpfChange}
                        keyboardType="numeric"
                        maxLength={14} // Limita o tamanho visual
                        returnKeyType="next"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder='Senha (mín. 6 caracteres)'
                        placeholderTextColor="#999"
                        value={senha}
                        secureTextEntry
                        onChangeText={setSenha}
                        returnKeyType="next"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder='Confirmar senha'
                        placeholderTextColor="#999"
                        value={confirmarSenha}
                        secureTextEntry
                        onChangeText={setConfirmarSenha}
                        returnKeyType="send"
                        onSubmitEditing={handleCadastro}
                    />

                    <TouchableOpacity 
                        style={[styles.cadastroButton, loading && styles.buttonDisabled]} 
                        onPress={handleCadastro}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.cadastroButtonText}>Cadastrar</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.linksContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.link}>Já tem uma conta? <Text style={{fontWeight: 'bold'}}>Faça login</Text></Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}