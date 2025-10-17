import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import api from '../../services/api'; 
import styles from './styles';

export default function Login() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('anaclara@email.com');
    const [senha, setSenha] = useState('123456');

    async function Acesso() {
        if (!email || !senha) {
            Alert.alert('Atenção!', 'E-mail e senha são obrigatórios.');
            return;
        }

        try {
            const requestData = {
                usu_email: email,
                usu_senha: senha
            };

            // CORREÇÃO 1: A rota de login geralmente é '/login' e não aninhada em '/usuarios'.
            // Isto também corresponde ao comentário que estava no seu código.
            const response = await api.post('/usuarios/login', requestData);

            if (response.data.sucesso) {
                // CORREÇÃO 2: Obter os dados do usuário da resposta da API.
                const usuarioLogado = response.data.dados;

                // Limpa os campos após o sucesso
                setEmail('');
                setSenha('');
                
                // CORREÇÃO 3: Navegar para a próxima tela ENVIANDO o ID do usuário.
                // A tela de Perfil agora espera receber este 'userId'.
                navigation.navigate('BottonTab', { 
                    userId: usuarioLogado.usu_id 
                });

            } else {
                // A API pode retornar sucesso: false em casos que não geram erro http
                Alert.alert('Erro no Login', response.data.mensagem);
            }

        } catch (error) {
            if (error.response) {
                // Exibe a mensagem de erro vinda da API (ex: "Credenciais inválidas")
                Alert.alert('Erro!', error.response.data.mensagem);
            } else {
                // Erro de rede ou outra questão
                Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua rede.');
            }
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
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

                    <TouchableOpacity style={styles.loginButton} onPress={Acesso}>
                        <Text style={styles.loginButtonText}>Acessar sistema</Text>
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