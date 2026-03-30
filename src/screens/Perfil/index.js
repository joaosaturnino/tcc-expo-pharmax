import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    LayoutAnimation,
    UIManager
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import api from '../../services/api';
import styles from './styles'; 

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Perfil() {
    const navigation = useNavigation();
    const route = useRoute();
    const { userId: userIdParam } = route.params || {};

    const [usuarioId, setUsuarioId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [userData, setUserData] = useState({
        nome: '',
        email: '',
        cpf: ''
    });

    const formatarCPF = (text) => {
        let value = text.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return value;
    };

    async function carregarDadosDaApi(id) {
        if (!id) return;
        try {
            const response = await api.get(`/usuarios/${id}`);
            if (response.data && response.data.sucesso) {
                const dados = response.data.dados;
                setUserData({
                    nome: dados.usu_nome || dados.nome || '',
                    email: dados.usu_email || dados.email || '',
                    cpf: dados.usu_cpf || dados.cpf || ''
                });
            }
        } catch (error) {
            console.error("Erro ao carregar:", error);
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            async function identificarUsuario() {
                setLoading(true);
                if (userIdParam) {
                    setUsuarioId(userIdParam);
                    await carregarDadosDaApi(userIdParam);
                    return;
                }
                try {
                    const jsonValue = await AsyncStorage.getItem('usuario_info');
                    if (jsonValue) {
                        const usuarioLocal = JSON.parse(jsonValue);
                        const idSalvo = usuarioLocal.usu_id || usuarioLocal.id;
                        
                        if (idSalvo) {
                            setUsuarioId(idSalvo);
                            await carregarDadosDaApi(idSalvo);
                        } else {
                            fazerLogout();
                        }
                    } else {
                        fazerLogout();
                    }
                } catch (e) { 
                    setLoading(false); 
                }
            }
            identificarUsuario();
        }, [userIdParam])
    );

    // Função segura de Logout
    const fazerLogout = async () => {
        try {
            await AsyncStorage.clear();
            // Tenta resetar a navegação pai (Stack) em vez da Tab
            const parent = navigation.getParent();
            if (parent) {
                parent.reset({ index: 0, routes: [{ name: 'Login' }] });
            } else {
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }
        } catch (error) {
            console.log(error);
            navigation.navigate('Login');
        }
    };

    const handleSave = async () => {
        if (!userData.nome || !userData.email) return Alert.alert('Atenção', 'Preencha os campos obrigatórios.');
        
        setIsSaving(true);
        try {
            const payload = { 
                usu_nome: userData.nome, 
                usu_email: userData.email, 
                usu_cpf: userData.cpf 
            };
            
            const response = await api.put(`/usuarios/${usuarioId}`, payload);

            if (response.data.sucesso) {
                Alert.alert('Sucesso', 'Perfil atualizado!');
                const jsonValue = await AsyncStorage.getItem('usuario_info');
                if (jsonValue) {
                    const local = JSON.parse(jsonValue);
                    local.usu_nome = userData.nome;
                    local.usu_email = userData.email;
                    local.usu_cpf = userData.cpf;
                    await AsyncStorage.setItem('usuario_info', JSON.stringify(local));
                }
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setEditing(false);
                await carregarDadosDaApi(usuarioId);
            } else {
                Alert.alert('Erro', response.data.mensagem || 'Falha ao atualizar.');
            }
        } catch (error) { 
            Alert.alert('Erro', 'Verifique sua conexão.'); 
        } finally { 
            setIsSaving(false); 
        }
    };

    const toggleEdit = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setEditing(!editing);
    };

    const handleLogoutConfirm = () => {
        Alert.alert("Sair", "Tem certeza que deseja desconectar?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sair", style: "destructive", onPress: fazerLogout }
        ]);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#458B00" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            
            <View style={styles.container}>
                
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Meu Perfil</Text>
                    
                    {!editing && (
                        <TouchableOpacity onPress={toggleEdit} style={styles.editToggleBtn}>
                            <Ionicons name="create-outline" size={22} color="#458B00" />
                        </TouchableOpacity>
                    )}
                    {editing && (
                        <TouchableOpacity onPress={toggleEdit} style={styles.editToggleBtn}>
                            <Text style={{color:'#64748B', fontWeight:'600'}}>Cancelar</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    
                    <View style={styles.profileHeader}>
                        <View style={styles.photoContainer}>
                            <View style={styles.profilePhoto}>
                                <Ionicons name="person" size={55} color="#CBD5E1" />
                            </View>
                            <TouchableOpacity style={styles.cameraBadge} onPress={() => Alert.alert("Em breve", "Troca de foto.")}>
                                <Ionicons name="camera" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>{userData.nome || 'Usuário'}</Text>
                        <Text style={styles.userEmail}>{userData.email || 'email@exemplo.com'}</Text>
                    </View>

                    <View style={styles.form}>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nome Completo</Text>
                            <View style={[styles.inputContainer, editing && styles.inputContainerEditable]}>
                                <Ionicons name="person-outline" size={20} color={editing ? "#458B00" : "#94A3B8"} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={userData.nome}
                                    onChangeText={(t) => setUserData({ ...userData, nome: t })}
                                    editable={editing}
                                    placeholder="Seu nome"
                                    placeholderTextColor="#94A3B8"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>E-mail</Text>
                            <View style={[styles.inputContainer, editing && styles.inputContainerEditable]}>
                                <Ionicons name="mail-outline" size={20} color={editing ? "#458B00" : "#94A3B8"} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={userData.email}
                                    onChangeText={(t) => setUserData({ ...userData, email: t })}
                                    editable={editing}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholder="seu@email.com"
                                    placeholderTextColor="#94A3B8"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>CPF</Text>
                            <View style={[styles.inputContainer, editing && styles.inputContainerEditable]}>
                                <Ionicons name="card-outline" size={20} color={editing ? "#458B00" : "#94A3B8"} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={userData.cpf}
                                    onChangeText={(t) => setUserData({ ...userData, cpf: formatarCPF(t) })}
                                    editable={editing}
                                    keyboardType="numeric"
                                    maxLength={14}
                                    placeholder="000.000.000-00"
                                    placeholderTextColor="#94A3B8"
                                />
                            </View>
                        </View>

                        <View style={styles.footerButtons}>
                            {editing && (
                                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
                                    {isSaving ? <ActivityIndicator color="#FFF" /> : (
                                        <>
                                            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                                            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutConfirm}>
                                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                                <Text style={styles.logoutText}>Sair da Conta</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}