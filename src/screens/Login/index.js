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
    ActivityIndicator,
    StatusBar // <--- Importante
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../services/api';
import styles from './styles';

export default function Login() {
    const navigation = useNavigation();
    const senhaRef = useRef();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    async function Acesso() {
        if (!email || !senha) {
            Alert.alert('Atenção!', 'E-mail e senha são obrigatórios.');
            return;
        }

        setLoading(true);

        try {
            const requestData = { usu_email: email, usu_senha: senha };
            const response = await api.post('/usuarios/login', requestData);

            if (response.data.sucesso) {
                const usuarioLogado = response.data.dados;
                await AsyncStorage.setItem('usuario_info', JSON.stringify(usuarioLogado));
                setEmail('');
                setSenha('');
                navigation.navigate('BottonTab', { userId: usuarioLogado.usu_id });
            } else {
                Alert.alert('Erro no Login', response.data.mensagem || 'Verifique suas credenciais.');
            }

        } catch (error) {
            console.error("Erro login:", error);
            if (error.response) {
                Alert.alert('Erro!', error.response.data.mensagem || 'Erro desconhecido.');
            } else {
                Alert.alert('Erro de Conexão', 'Não foi possível conectar.');
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
            {/* CORREÇÃO AQUI: BARRA BRANCA COM ÍCONES PRETOS */}
            <StatusBar 
                barStyle="dark-content" 
                backgroundColor="#FFFFFF" 
                translucent={false} 
            />

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
                        onSubmitEditing={() => senhaRef.current.focus()}
                        blurOnSubmit={false}
                    />

                    <TextInput
                        ref={senhaRef}
                        style={styles.input}
                        placeholder='Senha'
                        placeholderTextColor="#999"
                        value={senha}
                        secureTextEntry
                        onChangeText={setSenha}
                        returnKeyType="send"
                        onSubmitEditing={Acesso}
                    />

                    <TouchableOpacity
                        style={[styles.loginButton, loading && { opacity: 0.7 }]}
                        onPress={Acesso}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.loginButtonText}>Acessar sistema</Text>
                        )}
                    </TouchableOpacity>

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