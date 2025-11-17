import { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput, 
    Alert, 
    ScrollView, 
    Image, 
    ActivityIndicator, 
    StyleSheet 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// CORREÇÃO 1: Importar a biblioteca de ícones
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
        telefone: '', 
        foto: null    
    });

    // Função de Logout (sem alteração)
    const handleLogout = () => {
        Alert.alert(
            "Sair",
            "Tem certeza que deseja sair da sua conta?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Sair", 
                    onPress: async () => {
                        await AsyncStorage.removeItem('usuario_info');
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }], 
                        });
                    },
                    style: "destructive"
                }
            ]
        );
    };

    // Função carregarDadosDaApi (sem alteração)
    async function carregarDadosDaApi(id) {
        if (!id) {
            Alert.alert("Erro", "ID do usuário não fornecido.");
            setLoading(false);
            return;
        }
        try {
            const response = await api.get(`/usuarios/${id}`);
            if (response.data && response.data.sucesso) {
                const usuarioAtual = response.data.dados[0]; 
                if (usuarioAtual && typeof usuarioAtual === 'object') {
                    setUserData(prevState => ({
                        ...prevState,
                        nome: usuarioAtual.usu_nome || '',
                        email: usuarioAtual.usu_email || '',
                    }));
                } else {
                     Alert.alert('Erro de Dados', `Os dados para o usuário ${id} não foram recebidos corretamente.`);
                }
            } else {
                Alert.alert('Erro da API', response.data.mensagem || 'Não foi possível obter os dados do usuário.');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                 Alert.alert('Erro', `Usuário com ID ${id} não foi encontrado na API.`);
            } else {
                Alert.alert('Erro de Conexão', 'Não foi possível carregar os dados do perfil.');
            }
        } finally {
            setLoading(false);
        }
    }

    // useFocusEffect para buscar o usuário (sem alteração)
    useFocusEffect(
        useCallback(() => {
            async function carregarDadosDoStorage() {
                setLoading(true);
                try {
                    const userDataString = await AsyncStorage.getItem('usuario_info');
                    if (userDataString) {
                        const usuario = JSON.parse(userDataString);
                        if (usuario && usuario.usu_id) {
                            setUsuarioId(usuario.usu_id);
                            carregarDadosDaApi(usuario.usu_id); 
                        } else {
                            Alert.alert("Erro", "Não foi possível ler seus dados. Por favor, faça login novamente.");
                            navigation.navigate('Login');
                        }
                    } else {
                        Alert.alert("Acesso Negado", "Você precisa estar logado para ver seu perfil.");
                        navigation.navigate('Login');
                    }
                } catch (e) {
                    console.error("Erro ao ler AsyncStorage", e);
                    setLoading(false);
                }
            }
            carregarDadosDoStorage();
        }, [navigation])
    );

    // handleSave (sem alteração)
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
            const response = await api.put(`/usuarios/${usuarioId}`, dadosParaApi);
            if (response.data.sucesso) {
                Alert.alert('Sucesso!', 'Os seus dados foram salvos.');
                setEditing(false);
                await carregarDadosDaApi(usuarioId); 
            } else {
                Alert.alert('Erro ao Salvar', response.data.mensagem);
            }
        } catch (error) {
            if (error.response) {
                const errorData = JSON.stringify(error.response.data, null, 2);
                Alert.alert('Erro Recebido da API', errorData);
            } else {
                Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    // trocarFoto (sem alteração)
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
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>O meu Perfil</Text>
            </View>
            <View style={styles.profileContainer}>
                <View style={styles.photoContainer}>
                    <TouchableOpacity onPress={editing ? trocarFoto : null} disabled={!editing}>
                        {/* CORREÇÃO 2: Lógica do Ícone Estático */}
                        {userData.foto ? (
                            // Se tiver foto (vinda da API ou selecionada)
                            <Image source={{ uri: userData.foto }} style={styles.profilePhoto}/>
                        ) : (
                            // Se não tiver foto, mostra o ícone estático
                            <View style={styles.profilePhoto}>
                                <Ionicons name="person" size={50} color="white" />
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

                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <Text style={styles.buttonText}>Sair</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

// Estilos para o Loading (sem alteração)
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