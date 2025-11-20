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
import { Ionicons } from '@expo/vector-icons';

// Importação da API e Estilos
import api from '../../services/api'; 
import styles from './styles';

export default function Senha() {
    const navigation = useNavigation();
    
    // Estados para capturar os dados dos inputs
    const [email, setEmail] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    
    // Estado para controlar o spinner de carregamento
    const [loading, setLoading] = useState(false);

    async function handleAlterarSenha() {
        // 1. VALIDAÇÕES LOCAIS (FRONTEND)
        // Evita chamar a API se os dados já estiverem visivelmente errados
        
        if (!email || !novaSenha || !confirmarSenha) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }

        // Regex simples para validar formato de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Erro', 'Insira um e-mail válido.');
            return;
        }

        // Verifica se a senha e a confirmação são iguais
        if (novaSenha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        if (novaSenha.length < 6) {
            Alert.alert('Erro', 'A nova senha deve ter no mínimo 6 caracteres.');
            return;
        }

        // 2. ENVIO PARA A API (BACKEND)
        setLoading(true); // Ativa o loading

        try {
            // Faz a requisição PUT enviando o email e a nova senha.
            // NOTA: Certifique-se que seu backend aceita essa rota '/usuarios/redefinir'
            const response = await api.put('/usuarios/redefinir', {
                email: email,
                novaSenha: novaSenha
            });

            // Verifica a resposta padrão { sucesso: true, ... }
            if (response.data.sucesso) {
                Alert.alert(
                    'Sucesso',
                    'Sua senha foi alterada com sucesso!',
                    [
                        // Ao clicar em OK, manda o usuário de volta para o Login
                        { text: 'Fazer Login', onPress: () => navigation.navigate('Login') }
                    ]
                );
            } else {
                // Erro de negócio (Ex: E-mail não encontrado no banco)
                Alert.alert('Erro', response.data.mensagem || 'Não foi possível alterar a senha.');
            }

        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            
            // Tratamento de erro robusto
            if (error.response) {
                // O servidor respondeu com um status de erro (ex: 400, 404, 500)
                Alert.alert('Erro', error.response.data.mensagem || 'Erro ao processar solicitação.');
            } else {
                // Erro de conexão (internet caiu ou servidor fora do ar)
                Alert.alert('Erro de Conexão', 'Verifique sua internet ou tente novamente mais tarde.');
            }
        } finally {
            setLoading(false); // Desativa o loading sempre, dando certo ou errado
        }
    }

    return (
        // KeyboardAvoidingView empurra o conteúdo para cima quando o teclado abre
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                {/* --- CABEÇALHO --- */}
                <View style={styles.header}>
                    {/* Botão Voltar (Adicionado) */}
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={28} color="#2c3e50" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Redefinir Senha</Text>
                    <Text style={styles.subtitle}>
                        Informe seu e-mail e a nova senha desejada para atualizar seu cadastro.
                    </Text>
                </View>

                {/* --- FORMULÁRIO --- */}
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Seu E-mail Cadastrado'
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none" // Importante para emails
                        returnKeyType="next"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder='Nova Senha'
                        placeholderTextColor="#999"
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                        secureTextEntry // Esconde a senha
                        returnKeyType="next"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder='Confirmar Nova Senha'
                        placeholderTextColor="#999"
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        secureTextEntry
                        returnKeyType="done"
                        onSubmitEditing={handleAlterarSenha} // Ao dar enter no último campo, tenta enviar
                    />

                    {/* Botão de Ação */}
                    <TouchableOpacity
                        style={[styles.recuperarButton, loading && styles.buttonDisabled]}
                        onPress={handleAlterarSenha}
                        disabled={loading} // Evita múltiplos cliques
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.recuperarButtonText}>Alterar Senha</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}