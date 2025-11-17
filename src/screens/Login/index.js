import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// CORREÇÃO 1: Importar o AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../services/api'; 
import styles from './styles';

export default function Login() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('ana.silva@email.com');
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
            
            // Rota de login (está correta)
            const response = await api.post('/usuarios/login', requestData);

            if (response.data.sucesso) {
                // CORREÇÃO 2: Obter os dados do usuário da resposta.
                const usuarioLogado = response.data.dados;

                // CORREÇÃO 3: Salvar o usuário no AsyncStorage
                // A chave 'usuario_info' é a mesma que a tela Produto (Favoritos) espera!
                await AsyncStorage.setItem('usuario_info', JSON.stringify(usuarioLogado));

                // Limpa os campos após o sucesso
                setEmail('');
                setSenha('');
                
                // CORREÇÃO 4: Navegar para a tela principal
                // Não precisamos mais enviar o ID, pois ele está salvo no AsyncStorage
                navigation.navigate('BottonTab'); 

            } else {
                Alert.alert('Erro no Login', response.data.mensagem);
            }

        } catch (error) {
            if (error.response) {
                Alert.alert('Erro!', error.response.data.mensagem);
            } else {
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