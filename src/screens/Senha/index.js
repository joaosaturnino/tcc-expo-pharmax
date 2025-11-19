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

// Certifique-se de que o caminho para api está correto
import api from '../../services/api'; 
import styles from './styles';

export default function Senha() {
    const navigation = useNavigation();
    
    const [email, setEmail] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleAlterarSenha() {
        // 1. Validações Básicas
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

        // 2. Envio para a API
        setLoading(true);

        try {
            // Ajuste a rota '/usuarios/redefinir' conforme seu Backend
            const response = await api.put('/redefinir', {
                email: email,
                novaSenha: novaSenha
            });

            if (response.data.sucesso) {
                Alert.alert(
                    'Sucesso',
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
                Alert.alert('Erro de Conexão', 'Verifique sua internet.');
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
                
                {/* Cabeçalho com Botão Voltar */}
                <View style={styles.header}>
                    

                    <Text style={styles.title}>Redefinir Senha</Text>
                    <Text style={styles.subtitle}>
                        Informe seu e-mail e a nova senha desejada.
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Seu E-mail Cadastrado'
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        returnKeyType="next"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder='Nova Senha'
                        placeholderTextColor="#999"
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                        secureTextEntry
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
                        onSubmitEditing={handleAlterarSenha}
                    />

                    <TouchableOpacity
                        style={[styles.recuperarButton, loading && styles.buttonDisabled]}
                        onPress={handleAlterarSenha}
                        disabled={loading}
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