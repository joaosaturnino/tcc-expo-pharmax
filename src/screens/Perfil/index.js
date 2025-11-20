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
    Platform
} from 'react-native';
// useFocusEffect é essencial para recarregar os dados sempre que a tela "ganha foco"
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import api from '../../services/api';
import styles from './styles';

export default function Perfil() {
    const navigation = useNavigation();
    const route = useRoute();

    // 1. RECUPERAÇÃO DO ID:
    // Tenta pegar o ID vindo da navegação (BottonTab -> Perfil).
    // O "|| {}" evita erro caso route.params seja undefined.
    const { userId: userIdParam } = route.params || {};

    // Estados para gerenciar a tela
    const [usuarioId, setUsuarioId] = useState(null);
    const [loading, setLoading] = useState(true);       // Tela de carregamento inicial
    const [editing, setEditing] = useState(false);      // Controla se os inputs estão editáveis
    const [isSaving, setIsSaving] = useState(false);    // Loading do botão de salvar

    // Estado único para os dados do formulário
    const [userData, setUserData] = useState({
        nome: '',
        email: '',
        cpf: ''
    });

    // --- HELPER: MÁSCARA CPF ---
    // Formata o texto para o padrão 000.000.000-00
    const formatarCPF = (text) => {
        let value = text.replace(/\D/g, ''); // Remove tudo que não é dígito
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return value;
    };

    // --- BUSCA DE DADOS (API) ---
    async function carregarDadosDaApi(id) {
        if (!id) return;
        try {
            const response = await api.get(`/usuarios/${id}`);

            if (response.data && response.data.sucesso) {
                const dados = response.data.dados;
                // Preenche os inputs com os dados vindos do banco
                setUserData({
                    nome: dados.usu_nome || '',
                    email: dados.usu_email || '',
                    cpf: dados.usu_cpf || ''
                });
            }
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            Alert.alert("Erro", "Não foi possível carregar seus dados.");
        } finally {
            setLoading(false); // Desativa o loading independente do resultado
        }
    }

    // --- LÓGICA DE IDENTIFICAÇÃO ---
    // O useFocusEffect roda toda vez que o usuário entra nesta tela.
    useFocusEffect(
        useCallback(() => {
            async function identificarUsuario() {
                setLoading(true);

                // Prioridade 1: ID vindo da navegação (Login -> Home -> Perfil)
                if (userIdParam) {
                    setUsuarioId(userIdParam);
                    await carregarDadosDaApi(userIdParam);
                    return;
                }

                // Prioridade 2: ID salvo no celular (AsyncStorage)
                // Útil se o usuário fechou e abriu o app e o estado da navegação se perdeu
                try {
                    const jsonValue = await AsyncStorage.getItem('usuario_info');
                    if (jsonValue) {
                        const usuarioLocal = JSON.parse(jsonValue);
                        if (usuarioLocal.usu_id) {
                            setUsuarioId(usuarioLocal.usu_id);
                            await carregarDadosDaApi(usuarioLocal.usu_id);
                        }
                    } else {
                        // Se não achar ID nenhum, manda de volta pro Login
                        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    }
                } catch (e) {
                    setLoading(false);
                }
            }
            identificarUsuario();
        }, [userIdParam]) // Array de dependências: recria a função se o param mudar
    );

    // --- SALVAR ALTERAÇÕES ---
    const handleSave = async () => {
        // Validação simples
        if (!userData.nome || !userData.email) {
            return Alert.alert('Atenção', 'Nome e E-mail são obrigatórios.');
        }

        setIsSaving(true); // Ativa o spinner no botão

        try {
            const dadosParaAtualizar = {
                usu_nome: userData.nome,
                usu_email: userData.email,
                usu_cpf: userData.cpf
            };

            const response = await api.put(`/usuarios/${usuarioId}`, dadosParaAtualizar);

            if (response.data.sucesso) {
                Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');

                // ATUALIZAÇÃO DE CACHE:
                // É importante atualizar o AsyncStorage também, para que na próxima vez
                // que o app abrir, ele mostre o nome novo sem precisar chamar a API.
                const jsonValue = await AsyncStorage.getItem('usuario_info');
                if (jsonValue) {
                    const usuarioLocal = JSON.parse(jsonValue);
                    usuarioLocal.usu_nome = userData.nome;
                    usuarioLocal.usu_email = userData.email;
                    await AsyncStorage.setItem('usuario_info', JSON.stringify(usuarioLocal));
                }

                setEditing(false); // Sai do modo de edição
                await carregarDadosDaApi(usuarioId); // Recarrega dados para confirmar
            } else {
                Alert.alert('Erro', response.data.mensagem || 'Não foi possível atualizar.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Falha na conexão ao salvar.');
        } finally {
            setIsSaving(false);
        }
    };

    // --- LOGOUT ---
    const handleLogout = () => {
        Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Sair",
                style: "destructive", // Estilo vermelho no iOS
                onPress: async () => {
                    await AsyncStorage.clear(); // Limpa dados salvos
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); // Reseta histórico e vai pro login
                }
            }
        ]);
    };

    // Renderização de Loading Tela Cheia
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#66CD00" />
                <Text style={styles.loadingText}>Carregando perfil...</Text>
            </View>
        );
    }

    return (
        // KeyboardAvoidingView: Empurra a tela pra cima quando o teclado abre
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.title}>Meu Perfil</Text>
                </View>

                <View style={styles.profileContainer}>

                    {/* ÁREA DA FOTO (AVATAR PADRÃO) */}
                    <View style={styles.photoWrapper}>
                        <View style={styles.profilePhotoPlaceholder}>
                            {/* Ícone estático, já que não há upload de foto */}
                            <Ionicons name="person" size={60} color="#FFF" />
                        </View>
                    </View>

                    {/* FORMULÁRIO */}
                    <View style={styles.form}>
                        <Text style={styles.label}>Nome Completo</Text>
                        <TextInput
                            // Muda o estilo visual dependendo se está editando ou não
                            style={editing ? styles.inputEditing : styles.inputReadonly}
                            value={userData.nome}
                            onChangeText={(t) => setUserData({ ...userData, nome: t })}
                            editable={editing} // Trava/Destrava a digitação
                        />

                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            style={editing ? styles.inputEditing : styles.inputReadonly}
                            value={userData.email}
                            onChangeText={(t) => setUserData({ ...userData, email: t })}
                            editable={editing}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>CPF</Text>
                        <TextInput
                            style={editing ? styles.inputEditing : styles.inputReadonly}
                            value={userData.cpf}
                            onChangeText={(t) => setUserData({ ...userData, cpf: formatarCPF(t) })}
                            editable={editing}
                            keyboardType="numeric"
                            maxLength={14}
                        />

                        {/* ÁREA DE BOTÕES */}
                        <View style={styles.buttonsContainer}>
                            {/* Alterna entre botão de "Editar" e "Salvar" */}
                            {editing ? (
                                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
                                    {isSaving ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <Text style={styles.buttonText}>Salvar Alterações</Text>
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                                    <Text style={styles.buttonText}>Editar Perfil</Text>
                                </TouchableOpacity>
                            )}

                            {/* Botão de Logout sempre visível */}
                            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                                <Text style={styles.logoutText}>Sair da Conta</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}