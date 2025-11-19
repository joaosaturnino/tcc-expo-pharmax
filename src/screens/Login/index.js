import React, { useState } from 'react';
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
    ActivityIndicator // Importado para mostrar o loading
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../services/api'; 
import styles from './styles';

export default function Login() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    
    // Estado para controlar o carregamento do botão
    const [loading, setLoading] = useState(false);

    async function Acesso() {
        if (!email || !senha) {
            Alert.alert('Atenção!', 'E-mail e senha são obrigatórios.');
            return;
        }

        // Inicia o loading
        setLoading(true);

        try {
            const requestData = {
                usu_email: email,
                usu_senha: senha
            };
            
            const response = await api.post('/usuarios/login', requestData);

            if (response.data.sucesso) {
                const usuarioLogado = response.data.dados;

                await AsyncStorage.setItem('usuario_info', JSON.stringify(usuarioLogado));

                setEmail('');
                setSenha('');
                
                navigation.navigate('BottonTab'); 

            } else {
                Alert.alert('Erro no Login', response.data.mensagem || 'Verifique suas credenciais.');
            }

        } catch (error) {
            console.error("Erro login:", error);
            if (error.response) {
                Alert.alert('Erro!', error.response.data.mensagem || 'Erro desconhecido do servidor.');
            } else {
                Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua internet.');
            }
        } finally {
            // Para o loading independente do resultado (sucesso ou erro)
            setLoading(false);
        }
    }

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
                        returnKeyType="next"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Senha'
                        placeholderTextColor="#999"
                        value={senha}
                        secureTextEntry
                        onChangeText={setSenha}
                        returnKeyType="send"
                        onSubmitEditing={Acesso} // Tenta logar ao dar Enter na senha
                    />

                    <TouchableOpacity 
                        style={[styles.loginButton, loading && { opacity: 0.7 }]} 
                        onPress={Acesso}
                        disabled={loading} // Evita múltiplos cliques
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.loginButtonText}>Acessar sistema</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.linksContainer}>
                        {/* CORREÇÃO: Nome da rota ajustado para CadUsuario */}
                        <TouchableOpacity onPress={() => navigation.navigate('Usuario')}>
                            <Text style={styles.link}>Cadastro de Usuários</Text>
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