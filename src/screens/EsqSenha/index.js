import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';

export default function EsqSenha() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');

    function handleRecuperarSenha() {
        // Validação básica
        if (!email) {
            Alert.alert('Erro', 'Por favor, informe seu e-mail.');
            return;
        }

        // Validação de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
            return;
        }

        // Simulação de envio de e-mail
        Alert.alert(
            'Sucesso',
            'Enviamos um link de recuperação para seu e-mail!',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.goBack();
                    }
                }
            ]
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Recuperar Senha</Text>
                    <Text style={styles.subtitle}>
                        Informe seu e-mail para receber instruções de recuperação
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='E-mail cadastrado'
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TouchableOpacity
                        style={styles.recuperarButton}
                        onPress={handleRecuperarSenha}
                    >
                        <Text style={styles.recuperarButtonText}>Enviar Link de Recuperação</Text>
                    </TouchableOpacity>

                    <View style={styles.linksContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.link}>Voltar para o login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}