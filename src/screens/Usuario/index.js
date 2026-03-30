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
    ActivityIndicator,
    StatusBar // <--- Mantido o import
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import api from '../../services/api';
import styles from './styles';

export default function CadUsuario() {
    const navigation = useNavigation();

    // Referências para foco
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

    // Estado para visibilidade da senha
    const [hidePass, setHidePass] = useState(true);
    const [hideConfirmPass, setHideConfirmPass] = useState(true);

    const [loading, setLoading] = useState(false);

    // Máscara de CPF
    const handleCpfChange = (text) => {
        let value = text.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        setCpf(value);
    };

    async function handleCadastro() {
        if (!nome || !email || !cpf || !senha || !confirmarSenha) {
            Alert.alert('Campos vazios', 'Por favor, preencha todos os dados.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('E-mail inválido', 'Verifique o endereço digitado.');
            return;
        }

        if (cpf.length < 14) {
            Alert.alert('CPF Inválido', 'O CPF está incompleto.');
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Senhas diferentes', 'A senha e a confirmação não coincidem.');
            return;
        }

        if (senha.length < 6) {
            Alert.alert('Senha fraca', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true);

        try {
            const dadosUsuario = {
                usu_nome: nome,
                usu_email: email,
                usu_cpf: cpf,
                usu_senha: senha
            };

            const response = await api.post('/usuarios', dadosUsuario);

            if (response.data.sucesso) {
                Alert.alert(
                    '🎉 Sucesso!',
                    'Cadastro realizado. Faça login para continuar.',
                    [{ text: 'Ir para Login', onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert('Ops!', response.data.mensagem || 'Não foi possível cadastrar.');
            }

        } catch (error) {
            console.error("Erro cadastro:", error);
            if (error.response) {
                Alert.alert('Atenção', error.response.data.mensagem || 'Erro ao processar cadastro.');
            } else {
                Alert.alert('Sem conexão', 'Verifique sua internet e tente novamente.');
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
            {/* Elemento decorativo de fundo */}
            <View style={styles.headerBackground} />
            
            {/* CORREÇÃO AQUI: Fundo BRANCO e Ícones PRETOS */}
            <StatusBar 
                barStyle="dark-content"   // Ícones Pretos
                backgroundColor="#FFFFFF" // Fundo Branco
                translucent={false}       // Ocupa o topo e empurra o app para baixo
            />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Criar Conta</Text>
                    <Text style={styles.subtitle}>Junte-se à PharmaX hoje mesmo</Text>
                </View>

                <View style={styles.formContainer}>
                    
                    {/* Input NOME */}
                    <View style={styles.inputArea}>
                        <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder='Nome completo'
                            placeholderTextColor="#999"
                            value={nome}
                            onChangeText={setNome}
                            autoCapitalize="words"
                            returnKeyType="next"
                            onSubmitEditing={() => emailRef.current.focus()}
                            blurOnSubmit={false}
                        />
                    </View>

                    {/* Input EMAIL */}
                    <View style={styles.inputArea}>
                        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            ref={emailRef}
                            style={styles.input}
                            placeholder='Seu melhor e-mail'
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            returnKeyType="next"
                            onSubmitEditing={() => cpfRef.current.focus()}
                            blurOnSubmit={false}
                        />
                    </View>

                    {/* Input CPF */}
                    <View style={styles.inputArea}>
                        <Ionicons name="card-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            ref={cpfRef}
                            style={styles.input}
                            placeholder='CPF (apenas números)'
                            placeholderTextColor="#999"
                            value={cpf}
                            onChangeText={handleCpfChange}
                            keyboardType="numeric"
                            maxLength={14}
                            returnKeyType="next"
                            onSubmitEditing={() => senhaRef.current.focus()}
                            blurOnSubmit={false}
                        />
                    </View>

                    {/* Input SENHA */}
                    <View style={styles.inputArea}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            ref={senhaRef}
                            style={styles.input}
                            placeholder='Senha'
                            placeholderTextColor="#999"
                            value={senha}
                            secureTextEntry={hidePass}
                            onChangeText={setSenha}
                            returnKeyType="next"
                            onSubmitEditing={() => confSenhaRef.current.focus()}
                            blurOnSubmit={false}
                        />
                        <TouchableOpacity style={styles.btnEye} onPress={() => setHidePass(!hidePass)}>
                            <Ionicons name={hidePass ? "eye-off-outline" : "eye-outline"} size={22} color="#999" />
                        </TouchableOpacity>
                    </View>

                    {/* Input CONFIRMAR SENHA */}
                    <View style={styles.inputArea}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            ref={confSenhaRef}
                            style={styles.input}
                            placeholder='Confirme a senha'
                            placeholderTextColor="#999"
                            value={confirmarSenha}
                            secureTextEntry={hideConfirmPass}
                            onChangeText={setConfirmarSenha}
                            returnKeyType="send"
                            onSubmitEditing={handleCadastro}
                        />
                        <TouchableOpacity style={styles.btnEye} onPress={() => setHideConfirmPass(!hideConfirmPass)}>
                            <Ionicons name={hideConfirmPass ? "eye-off-outline" : "eye-outline"} size={22} color="#999" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.cadastroButton, loading && styles.buttonDisabled]}
                        onPress={handleCadastro}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.cadastroButtonText}>CADASTRAR</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.linksContainer}>
                        <Text style={styles.linkText}>Já possui conta?</Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.linkBold}>Entrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}