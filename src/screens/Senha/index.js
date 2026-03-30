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
    StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import api from '../../services/api'; 
import styles from './styles';

export default function Senha() {
    const navigation = useNavigation();
    
    // Refs
    const emailRef = useRef();
    const senhaRef = useRef();
    const confSenhaRef = useRef();

    // Estados
    const [email, setEmail] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [hidePass, setHidePass] = useState(true);
    const [hideConfPass, setHideConfPass] = useState(true);

    async function handleAlterarSenha() {
        if (!email || !novaSenha || !confirmarSenha) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Erro', 'Insira um e-mail válido.');
            return;
        }

        if (novaSenha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        if (novaSenha.length < 6) {
            Alert.alert('Erro', 'A nova senha deve ter no mínimo 6 caracteres.');
            return;
        }

        setLoading(true);

        try {
            const response = await api.put('/usuarios/redefinir', {
                email: email,
                novaSenha: novaSenha
            });

            if (response.data.sucesso) {
                Alert.alert(
                    'Sucesso 🎉',
                    'Sua senha foi alterada com sucesso!',
                    [{ text: 'Fazer Login', onPress: () => navigation.navigate('Login') }]
                );
            } else {
                Alert.alert('Erro', response.data.mensagem || 'Não foi possível alterar a senha.');
            }

        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            if (error.response) {
                Alert.alert('Erro', error.response.data.mensagem || 'Erro ao processar solicitação.');
            } else {
                Alert.alert('Erro de Conexão', 'Verifique sua internet ou tente novamente.');
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
            {/* Fundo decorativo verde */}
            <View style={styles.headerBackground} />
            
            {/* --- MUDANÇA AQUI: BARRA BRANCA COM ÍCONES PRETOS --- */}
            <StatusBar 
                barStyle="dark-content"   // Ícones Pretos (Escuros)
                backgroundColor="#FFFFFF" // Fundo Branco
                translucent={false}       // A barra ocupa espaço e empurra o app para baixo
            />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                
                {/* --- CABEÇALHO --- */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Redefinir Senha</Text>
                    <Text style={styles.subtitle}>
                        Informe seu e-mail e a nova senha desejada para atualizar seu acesso.
                    </Text>
                </View>

                {/* --- FORMULÁRIO --- */}
                <View style={styles.formContainer}>
                    
                    {/* Input EMAIL */}
                    <View style={styles.inputArea}>
                        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            ref={emailRef}
                            style={styles.input}
                            placeholder='Seu E-mail Cadastrado'
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            returnKeyType="next"
                            onSubmitEditing={() => senhaRef.current.focus()}
                            blurOnSubmit={false}
                        />
                    </View>

                    {/* Input NOVA SENHA */}
                    <View style={styles.inputArea}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            ref={senhaRef}
                            style={styles.input}
                            placeholder='Nova Senha'
                            placeholderTextColor="#999"
                            value={novaSenha}
                            onChangeText={setNovaSenha}
                            secureTextEntry={hidePass}
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
                            placeholder='Confirmar Nova Senha'
                            placeholderTextColor="#999"
                            value={confirmarSenha}
                            onChangeText={setConfirmarSenha}
                            secureTextEntry={hideConfPass}
                            returnKeyType="done"
                            onSubmitEditing={handleAlterarSenha}
                        />
                        <TouchableOpacity style={styles.btnEye} onPress={() => setHideConfPass(!hideConfPass)}>
                            <Ionicons name={hideConfPass ? "eye-off-outline" : "eye-outline"} size={22} color="#999" />
                        </TouchableOpacity>
                    </View>

                    {/* Botão de Ação */}
                    <TouchableOpacity
                        style={[styles.recuperarButton, loading && styles.buttonDisabled]}
                        onPress={handleAlterarSenha}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.recuperarButtonText}>ALTERAR SENHA</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}