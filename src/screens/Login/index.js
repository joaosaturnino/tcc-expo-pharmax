import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './styles'; // Importando os estilos
import bottonTab from '../../routes/bottonTab';


import LogoEscrita from '../../public/LogoEscrita.png';

export default function Login() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const usuTemp = {
        id: 101,
        nome: 'João Henrique',
        email: 'joao@gmail.com',
        senha: '123456',
        tipo: 'cliente'
    };

    function Acesso() {
        if (usuTemp.email === email && usuTemp.senha === senha) {
            navigation.navigate('BottonTab', { usuTemp });
        } else {
            Alert.alert(
                'Erro! Senha ou e-mail inválidos',
                '',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
            );
        }
        setEmail('');
        setSenha('');
    }

    return (
        <View style={styles.container}>
            <Image
                source={LogoEscrita}
                style={styles.logo}
                resizeMode="contain"
            />
            <TextInput
                style={styles.input}
                placeholder='e-mail'
                value={email}
                onChangeText={v => setEmail(v)}
            />
            <TextInput
                style={styles.input}
                placeholder='senha'
                value={senha}
                secureTextEntry
                onChangeText={v => setSenha(v)}
            />
            <TouchableOpacity style={styles.button} onPress={Acesso}>
                <Text style={styles.buttonText}>Acessar sistema</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('CadUsuario')}>
                <Text style={styles.link}>Cadastro de Usuários</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('EsqSenha')}>
                <Text style={styles.link}>Esqueceu a senha</Text>
            </TouchableOpacity>
        </View>
    );
}