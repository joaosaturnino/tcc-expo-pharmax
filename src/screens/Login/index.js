import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';

export default function Login() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const usuTemp = {
        id: 101,
        nome: 'João Henrique',
        email: '123456',
        senha: '123456',
        tipo: 'cliente'
    };

    function Acesso() {
        if (usuTemp.email === email && usuTemp.senha === senha) {
            // navigation.navigate('BottonTab', { usuTemp });
            navigation.navigate('BottonTab' );
        } else {
            Alert.alert(
                'Erro!',
                'Senha ou e-mail inválidos',
                [{ text: 'OK' }]
            );
        }
        setEmail('');
        setSenha('');
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