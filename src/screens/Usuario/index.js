import React, { useState, useRef } from 'react';
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
// Importante para o ícone da seta de voltar
import { Ionicons } from '@expo/vector-icons';

import api from '../../services/api';
import styles from './styles';

export default function CadUsuario() {
    const navigation = useNavigation();

    // 1. REFERÊNCIAS (UX):
    // Usamos useRef para criar uma cadeia de foco. Quando o usuário der "Enter"
    // no teclado, o cursor pula automaticamente para o próximo campo.
    const emailRef = useRef();
    const cpfRef = useRef();
    const senhaRef = useRef();
    const confSenhaRef = useRef();

    // Estados do formulário
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    // Estado de carregamento (spinner)
    const [loading, setLoading] = useState(false);

    // 2. MÁSCARA DE CPF:
    // Formata o texto enquanto o usuário digita (000.000.000-00)
    const handleCpfChange = (text) => {
        let value = text.replace(/\D/g, ''); // Remove tudo que não é número
        if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

        // Aplica a máscara visualmente
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        setCpf(value);
    };

    async function handleCadastro() {
        // 3. VALIDAÇÕES DO FRONTEND:
        // Verificamos tudo antes de chamar o servidor para economizar dados e tempo.

        if (!nome || !email || !cpf || !senha || !confirmarSenha) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            return;
        }

        // Validação simples de formato de e-mail (Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
            return;
        }

        if (cpf.length < 14) {
            Alert.alert('Erro', 'O CPF está incompleto.');
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

        setLoading(true); // Inicia o spinner

        try {
            const dadosUsuario = {
                usu_nome: nome,
                usu_email: email,
                usu_cpf: cpf,
                usu_senha: senha
            };

            // Chamada POST para a API
            const response = await api.post('/usuarios', dadosUsuario);

            if (response.data.sucesso) {
                Alert.alert(
                    'Sucesso',
                    'Cadastro realizado com sucesso!',
                    // Ao clicar em OK, volta para a tela anterior (Login)
                    [{ text: 'Fazer Login', onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert('Erro', response.data.mensagem || 'Não foi possível cadastrar.');
            }

        } catch (error) {
            console.error("Erro cadastro:", error);
            if (error.response) {
                // Erro vindo do backend (ex: Email já existe)
                Alert.alert('Atenção', error.response.data.mensagem || 'Erro ao processar cadastro.');
            } else {
                // Erro de rede/internet
                Alert.alert('Erro de Conexão', 'Verifique sua internet e tente novamente.');
            }
        } finally {
            setLoading(false); // Para o spinner sempre, dando certo ou errado
        }
    }

    return (
        // KeyboardAvoidingView: Empurra a tela para cima quando o teclado abre (iOS/Android)
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.header}>
                    {/* BOTÃO VOLTAR (Implementado) */}
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color="#2c3e50" />
                    </TouchableOpacity>

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
                        autoCapitalize="words" // Primeira letra maiúscula em cada palavra
                        returnKeyType="next" // Botão "Próximo" no teclado
                        onSubmitEditing={() => emailRef.current.focus()} // Pula para o próximo input
                        blurOnSubmit={false}
                    />

                    <TextInput
                        ref={emailRef}
                        style={styles.input}
                        placeholder='E-mail'
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none" // E-mail sempre minúsculo
                        returnKeyType="next"
                        onSubmitEditing={() => cpfRef.current.focus()}
                        blurOnSubmit={false}
                    />

                    <TextInput
                        ref={cpfRef}
                        style={styles.input}
                        placeholder='CPF (000.000.000-00)'
                        placeholderTextColor="#999"
                        value={cpf}
                        onChangeText={handleCpfChange} // Usa a função com máscara
                        keyboardType="numeric"
                        maxLength={14}
                        returnKeyType="next"
                        onSubmitEditing={() => senhaRef.current.focus()}
                        blurOnSubmit={false}
                    />

                    <TextInput
                        ref={senhaRef}
                        style={styles.input}
                        placeholder='Senha (mín. 6 caracteres)'
                        placeholderTextColor="#999"
                        value={senha}
                        secureTextEntry // Esconde a senha
                        onChangeText={setSenha}
                        returnKeyType="next"
                        onSubmitEditing={() => confSenhaRef.current.focus()}
                        blurOnSubmit={false}
                    />

                    <TextInput
                        ref={confSenhaRef}
                        style={styles.input}
                        placeholder='Confirmar senha'
                        placeholderTextColor="#999"
                        value={confirmarSenha}
                        secureTextEntry
                        onChangeText={setConfirmarSenha}
                        returnKeyType="send" // Botão "Enviar"
                        onSubmitEditing={handleCadastro} // Tenta cadastrar ao dar Enter
                    />

                    {/* Botão principal com Loading */}
                    <TouchableOpacity
                        style={[styles.cadastroButton, loading && styles.buttonDisabled]}
                        onPress={handleCadastro}
                        disabled={loading} // Evita múltiplos cliques
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.cadastroButtonText}>Cadastrar</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.linksContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.link}>Já tem uma conta? <Text style={{ fontWeight: 'bold' }}>Faça login</Text></Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}