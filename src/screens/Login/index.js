import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 1. Importe o serviço da API
import api from '../../services/api'; 
import styles from './styles';

export default function Login() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false); // Estado para controlar o carregamento

    // 2. Transforme a função em assíncrona para usar o 'await'
    const acessarSistema = async () => {
        // Validação simples
        if (!email || !senha) {
            Alert.alert('Erro!', 'Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true); // Inicia o carregamento

        try {
            // 3. Faça a requisição POST para a rota de login da API
            const response = await api.post('/usuarios/login', {
                email: email,
                senha: senha
            });

            // 4. Verifique a resposta da API
            if (response.data.sucesso) {
                const usuario = response.data.dados; // Pega os dados do usuário da resposta
                Alert.alert('Sucesso!', `Bem-vindo, ${usuario.nome}!`);
                navigation.navigate('BottonTab', { usuario }); // Navega para a próxima tela
            } else {
                Alert.alert('Erro!', response.data.mensagem || 'Credenciais inválidas.');
            }

        } catch (error) {
            // Tratamento de erros de rede ou do servidor
            console.error("Erro ao fazer login:", error);
            const mensagemErro = error.response?.data?.mensagem || 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
            Alert.alert('Falha na autenticação', mensagemErro);
        } finally {
            setLoading(false); // Finaliza o carregamento
            setEmail('');
            setSenha('');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../../public/LogoEscrita.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.formContainer}>
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
                        placeholder='Senha'
                        placeholderTextColor="#999"
                        value={senha}
                        secureTextEntry
                        onChangeText={setSenha}
                    />

                    {/* 5. Chame a nova função 'acessarSistema' e desabilite o botão durante o carregamento */}
                    <TouchableOpacity 
                        style={styles.loginButton} 
                        onPress={acessarSistema}
                        disabled={loading}
                    >
                        <Text style={styles.loginButtonText}>
                            {loading ? 'Carregando...' : 'Acessar sistema'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.linksContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('CadUsuario')}>
                            <Text style={styles.link}>Cadastro de Usuários</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('EsqSenha')}>
                            <Text style={styles.link}>Esqueceu a senha?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}