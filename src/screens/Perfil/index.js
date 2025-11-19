import React, { useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput, 
    Alert, 
    ScrollView, 
    Image, 
    ActivityIndicator, 
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 

import api from '../../services/api'; 
import styles from './styles'; 

export default function Perfil() {
    const navigation = useNavigation();
    
    const [usuarioId, setUsuarioId] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [editing, setEditing] = useState(false); 
    const [isSaving, setIsSaving] = useState(false); 

    const [userData, setUserData] = useState({
        nome: '',
        email: '',
        cpf: '',
        foto: null    
    });

    // --- MÁSCARA DE CPF ---
    const formatarCPF = (text) => {
        let value = text.replace(/\D/g, ''); 
        if (value.length > 11) value = value.slice(0, 11); 
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return value;
    };

    // --- BUSCAR DADOS NO BACKEND ---
    async function carregarDadosDaApi(id) {
        if (!id) return;

        try {
            console.log(`Buscando dados do ID: ${id}`);
            const response = await api.get(`/usuarios/${id}`);
            
            if (response.data && response.data.sucesso) {
                const dados = response.data.dados;
                
                setUserData(prevState => ({
                    ...prevState,
                    nome: dados.usu_nome || '',
                    email: dados.usu_email || '',
                    cpf: dados.usu_cpf || '', 
                }));
            } else {
                Alert.alert('Atenção', 'Não foi possível carregar seus dados atualizados.');
            }
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            Alert.alert('Erro', 'Falha na conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    }

    // --- EFEITO DE FOCO ---
    useFocusEffect(
        useCallback(() => {
            async function carregarUsuario() {
                setLoading(true);
                try {
                    const jsonValue = await AsyncStorage.getItem('usuario_info');
                    if (jsonValue) {
                        const usuarioLocal = JSON.parse(jsonValue);
                        if (usuarioLocal.usu_id) {
                            setUsuarioId(usuarioLocal.usu_id);
                            await carregarDadosDaApi(usuarioLocal.usu_id); 
                        }
                    } else {
                        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    }
                } catch (e) {
                    console.error("Erro AsyncStorage", e);
                    setLoading(false);
                }
            }
            carregarUsuario();
        }, [navigation])
    );

    // --- SALVAR ALTERAÇÕES ---
    const handleSave = async () => {
        if (!userData.nome || !userData.email) {
            Alert.alert('Erro', 'Nome e E-mail não podem ficar vazios.');
            return;
        }

        setIsSaving(true);
        try {
            const dadosParaAtualizar = {
                usu_nome: userData.nome,
                usu_email: userData.email,
                usu_cpf: userData.cpf
            };

            const response = await api.put(`/usuarios/${usuarioId}`, dadosParaAtualizar);
            
            if (response.data.sucesso) {
                Alert.alert('Sucesso', 'Seu perfil foi atualizado!');
                setEditing(false); 
                await carregarDadosDaApi(usuarioId); 
            } else {
                Alert.alert('Erro', response.data.mensagem || 'Erro ao salvar.');
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            Alert.alert('Erro', 'Não foi possível salvar as alterações.');
        } finally {
            setIsSaving(false);
        }
    };

    // --- TROCAR FOTO ---
    const trocarFoto = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
            Alert.alert("Permissão negada", "É necessário permitir o acesso à galeria.");
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

    // --- LOGOUT ---
    const handleLogout = () => {
        Alert.alert(
            "Sair",
            "Tem certeza que deseja desconectar?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Sair", 
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.clear();
                        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#66CD00" />
                <Text style={styles.loadingText}>Carregando perfil...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
                
                <View style={styles.header}>
                    <Text style={styles.title}>Meu Perfil</Text>
                </View>

                <View style={styles.profileContainer}>
                    <TouchableOpacity 
                        onPress={editing ? trocarFoto : null} 
                        activeOpacity={editing ? 0.7 : 1}
                        style={styles.photoWrapper}
                    >
                        {userData.foto ? (
                            <Image source={{ uri: userData.foto }} style={styles.profilePhoto}/>
                        ) : (
                            <View style={styles.profilePhotoPlaceholder}>
                                <Ionicons name="person" size={60} color="#FFF" />
                            </View>
                        )}
                        
                        {editing && (
                            <View style={styles.editIconBadge}>
                                <Ionicons name="camera" size={20} color="#FFF" />
                            </View>
                        )}
                    </TouchableOpacity>

                    <View style={styles.form}>
                        <Text style={styles.label}>Nome Completo</Text>
                        <TextInput
                            style={editing ? styles.inputEditing : styles.inputReadonly}
                            value={userData.nome}
                            onChangeText={(t) => setUserData({...userData, nome: t})}
                            editable={editing}
                        />

                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            style={editing ? styles.inputEditing : styles.inputReadonly}
                            value={userData.email}
                            onChangeText={(t) => setUserData({...userData, email: t})}
                            editable={editing}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>CPF</Text>
                        <TextInput
                            style={editing ? styles.inputEditing : styles.inputReadonly}
                            value={userData.cpf}
                            onChangeText={(t) => setUserData({...userData, cpf: formatarCPF(t)})}
                            editable={editing}
                            keyboardType="numeric"
                            maxLength={14}
                        />
                        
                        <View style={styles.buttonsContainer}>
                            {editing ? (
                                <TouchableOpacity 
                                    style={styles.saveButton} 
                                    onPress={handleSave} 
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <ActivityIndicator color="#FFF"/> 
                                    ) : (
                                        <Text style={styles.buttonText}>Salvar Alterações</Text>
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity 
                                    style={styles.editButton} 
                                    onPress={() => setEditing(true)}
                                >
                                    <Text style={styles.buttonText}>Editar Perfil</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity 
                                style={styles.logoutButton} 
                                onPress={handleLogout}
                            >
                                <Text style={styles.logoutText}>Sair da Conta</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}