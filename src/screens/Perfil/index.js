import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, Image, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';

import api from '../../services/api'; 
import styles from './styles'; 

export default function Perfil() {
    const route = useRoute();
    const { userId } = route.params || {};

    const [loading, setLoading] = useState(true); 
    const [editing, setEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false); 

    const [userData, setUserData] = useState({
        nome: '',
        email: '',
        telefone: '', 
        foto: null    
    });

    async function carregarDadosUsuario() {
        if (!userId) {
            Alert.alert("Erro", "ID do usuário não fornecido.");
            setLoading(false);
            return;
        }
        try {
            const response = await api.get(`/usuarios/${userId}`);
            if (response.data && response.data.sucesso) {
                const usuarioAtual = response.data.dados[0]; 
                if (usuarioAtual && typeof usuarioAtual === 'object') {
                    setUserData(prevState => ({
                        ...prevState,
                        nome: usuarioAtual.usu_nome || '',
                        email: usuarioAtual.usu_email || '',
                    }));
                } else {
                     Alert.alert('Erro de Dados', `Os dados para o usuário ${userId} não foram recebidos corretamente.`);
                }
            } else {
                Alert.alert('Erro da API', response.data.mensagem || 'Não foi possível obter os dados do usuário.');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                 Alert.alert('Erro', `Usuário com ID ${userId} não foi encontrado na API.`);
            } else {
                Alert.alert('Erro de Conexão', 'Não foi possível carregar os dados do perfil.');
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarDadosUsuario();
    }, [userId]);

    const handleSave = async () => {
        if (!userData.nome || !userData.email) {
            Alert.alert('Atenção', 'Nome e E-mail são campos obrigatórios.');
            return;
        }

        setIsSaving(true);

        try {
            const dadosParaApi = {
                usu_nome: userData.nome,
                usu_email: userData.email,
            };
            const response = await api.put(`/usuarios/${userId}`, dadosParaApi);
            if (response.data.sucesso) {
                Alert.alert('Sucesso!', 'Os seus dados foram salvos.');
                setEditing(false);
                await carregarDadosUsuario();
            } else {
                Alert.alert('Erro ao Salvar', response.data.mensagem);
            }
        } catch (error) {
            // --- CORREÇÃO PARA DEPURAÇÃO ---
            if (error.response) {
                // Transforma a resposta de erro completa da API em texto
                const errorData = JSON.stringify(error.response.data, null, 2);
                
                // Exibe o erro completo no alerta
                Alert.alert(
                    'Erro Recebido da API', // Título mais claro
                    errorData // Corpo do alerta agora mostra o erro real
                );
            } else {
                Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const trocarFoto = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Você se recusou a permitir que este aplicativo acesse suas fotos!");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setUserData(prevState => ({ ...prevState, foto: result.assets[0].uri }));
        }
    };

    if (loading) {
        return (
            <View style={loadingStyles.container}>
                <ActivityIndicator size="large" color="#A2CD5A" />
                <Text style={loadingStyles.text}>A carregar Perfil...</Text>
            </View>
        );
    }

    return (
        // O seu JSX permanece o mesmo
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>O meu Perfil</Text>
            </View>
            <View style={styles.profileContainer}>
                <View style={styles.photoContainer}>
                    <TouchableOpacity onPress={editing ? trocarFoto : null} disabled={!editing}>
                        {userData.foto ? (
                            <Image source={{ uri: userData.foto }} style={styles.profilePhoto}/>
                        ) : (
                            <View style={styles.profilePhoto}>
                                <Text style={styles.photoText}>{userData.nome ? userData.nome.charAt(0).toUpperCase() : '?'}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.form}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={editing ? styles.inputEditing : styles.input}
                        value={userData.nome}
                        onChangeText={(text) => setUserData({ ...userData, nome: text })}
                        editable={editing}
                    />
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={editing ? styles.inputEditing : styles.input}
                        value={userData.email}
                        onChangeText={(text) => setUserData({ ...userData, email: text })}
                        editable={editing}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Text style={styles.label}>Telefone</Text>
                    <TextInput
                        style={editing ? styles.inputEditing : styles.input}
                        value={userData.telefone}
                        onChangeText={(text) => setUserData({ ...userData, telefone: text })}
                        editable={editing}
                        keyboardType="phone-pad"
                    />
                    <View style={styles.buttons}>
                        {editing ? (
                            <TouchableOpacity
                                style={isSaving ? styles.saveButtonDisabled : styles.saveButton}
                                onPress={handleSave}
                                disabled={isSaving}
                            >
                                <Text style={styles.buttonText}>{isSaving ? 'A salvar...' : 'Salvar'}</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => setEditing(true)}
                            >
                                <Text style={styles.buttonText}>Editar Perfil</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const loadingStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        color: '#555'
    }
});