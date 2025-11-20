import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../services/api';
import styles from './styles';

export default function Login() {
    const navigation = useNavigation();

    // useRef: Cria uma referência direta ao input de senha.
    // Usamos isso para que, ao apertar "Próximo" no teclado do e-mail,
    // o foco vá direto para a senha.
    const senhaRef = useRef();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    // Loading: Controla o spinner girando enquanto a API responde
    const [loading, setLoading] = useState(false);

    async function Acesso() {
        // 1. Validação Básica
        if (!email || !senha) {
            Alert.alert('Atenção!', 'E-mail e senha são obrigatórios.');
            return;
        }

        setLoading(true); // Inicia o carregamento (bloqueia botão)

        try {
            // Objeto que será enviado ao backend
            const requestData = {
                usu_email: email,
                usu_senha: senha
            };

            // 2. Chamada à API
            const response = await api.post('/usuarios/login', requestData);

            // 3. Verificação de Sucesso
            if (response.data.sucesso) {
                const usuarioLogado = response.data.dados;

                // 4. Persistência (Salvar no celular)
                // AsyncStorage só aceita Strings, por isso usamos JSON.stringify
                await AsyncStorage.setItem('usuario_info', JSON.stringify(usuarioLogado));

                // Limpa campos para segurança visual se voltar a tela
                setEmail('');
                setSenha('');

                // 5. Navegação (CORREÇÃO IMPORTANTE)
                // Passamos o ID do usuário como parâmetro para a rota 'BottonTab'.
                // Isso garante que a Home e o Perfil recebam o ID corretamente.
                navigation.navigate('BottonTab', {
                    userId: usuarioLogado.usu_id // Certifique-se que seu banco retorna 'usu_id'
                });

            } else {
                // Se a senha estiver errada ou email não existir
                Alert.alert('Erro no Login', response.data.mensagem || 'Verifique suas credenciais.');
            }

        } catch (error) {
            console.error("Erro login:", error);
            // Tratamento de erros de rede ou servidor desligado
            if (error.response) {
                Alert.alert('Erro!', error.response.data.mensagem || 'Erro desconhecido do servidor.');
            } else {
                Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua internet.');
            }
        } finally {
            setLoading(false); // Para o carregamento independente de sucesso ou erro
        }
    }

    return (
        // KeyboardAvoidingView: Empurra o conteúdo para cima quando o teclado abre
        // para não cobrir o botão de login.
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {/* ScrollView permite rolar a tela em celulares pequenos */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                {/* Container da Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../../public/LogoEscrita.png')}
                        style={styles.logo}
                        resizeMode="contain" // Garante que a imagem apareça inteira sem cortar
                    />
                </View>

                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='E-mail'
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address" // Teclado com @
                        autoCapitalize="none" // Não colocar letra maiúscula automática
                        returnKeyType="next" // Botão "Próximo" no teclado

                        // Ao enviar, joga o foco para o input de senha (usando a referência)
                        onSubmitEditing={() => senhaRef.current.focus()}
                        blurOnSubmit={false}
                    />

                    <TextInput
                        ref={senhaRef} // Recebe a referência
                        style={styles.input}
                        placeholder='Senha'
                        placeholderTextColor="#999"
                        value={senha}
                        secureTextEntry // Esconde a senha (bolinhas)
                        onChangeText={setSenha}
                        returnKeyType="send" // Botão "Enviar/Ir" no teclado
                        onSubmitEditing={Acesso} // Tenta logar ao dar Enter
                    />

                    {/* Botão de Login com Loading */}
                    <TouchableOpacity
                        style={[styles.loginButton, loading && { opacity: 0.7 }]}
                        onPress={Acesso}
                        disabled={loading} // Desativa o clique se estiver carregando
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.loginButtonText}>Acessar sistema</Text>
                        )}
                    </TouchableOpacity>

                    {/* Links de Navegação */}
                    <View style={styles.linksContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Usuario')}>
                            <Text style={styles.link}>Não tem conta? <Text style={{ fontWeight: 'bold' }}>Cadastre-se</Text></Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Senha')}>
                            <Text style={styles.link}>Esqueceu a senha?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}