import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import styles from './styles';

// --- Função Helper de Promoção (sem alteração) ---
function calcularPrecoPromocional(item) {
    const precoOriginal = parseFloat(item.preco || item.medp_preco);
    const desconto = parseFloat(item.promo_desconto);

    if (isNaN(precoOriginal) || !desconto || desconto <= 0 || !item.promo_inicio || !item.promo_fim) {
        return { estaEmPromocao: false, descontoPorcento: 0 };
    }
    const hoje = new Date();
    const inicio = new Date(item.promo_inicio);
    const fim = new Date(item.promo_fim);
    hoje.setHours(0, 0, 0, 0);
    inicio.setHours(0, 0, 0, 0);
    fim.setHours(0, 0, 0, 0);
    const estaEmPromocao = (hoje >= inicio && hoje <= fim);
    if (estaEmPromocao) {
        return { estaEmPromocao: true, descontoPorcento: desconto };
    }
    return { estaEmPromocao: false, descontoPorcento: 0 };
}
// ---------------------------------------------------


export default function Favoritos() {
    const navigation = useNavigation();
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [usuarioId, setUsuarioId] = useState(null);

    // Função para carregar os favoritos (sem alteração)
    const carregarFavoritos = useCallback(async (isRefresh = false) => {
        if (!isRefresh) setLoading(true);
        let idDoUsuario = usuarioId;
        if (!idDoUsuario) {
            try {
                const userData = await AsyncStorage.getItem('usuario_info');
                if (!userData) {
                    setLoading(false);
                    setFavoritos([]);
                    return;
                }
                const usuario = JSON.parse(userData);
                idDoUsuario = usuario?.usu_id;
                setUsuarioId(idDoUsuario);
            } catch (e) {
                console.error("Erro ao ler AsyncStorage", e);
                setLoading(false);
                return;
            }
        }
        if (!idDoUsuario) {
            setLoading(false);
            return;
        }
        try {
            const response = await api.get(`/favoritos/usuario/${idDoUsuario}`);
            if (response.data.sucesso) {
                setFavoritos(response.data.dados);
            } else {
                Alert.alert('Erro', 'Não foi possível carregar os favoritos.');
            }
        } catch (error) {
            const mensagem = error.response?.data?.mensagem || 'Ocorreu um erro. Tente novamente.';
            Alert.alert('Erro na Requisição', mensagem);
        } finally {
            setLoading(false);
        }
    }, [usuarioId]);

    useFocusEffect(
        React.useCallback(() => {
            carregarFavoritos();
        }, [carregarFavoritos])
    );

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await carregarFavoritos(true);
        setIsRefreshing(false);
    }, [carregarFavoritos]);

    // Remover favorito (sem alteração)
    const removerFavorito = async (fav_id, nome) => {
        Alert.alert(
            "Remover Favorito",
            `Tem certeza que deseja remover ${nome} dos seus favoritos?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: async () => {
                        if (!usuarioId) {
                            Alert.alert('Erro', 'ID do usuário não encontrado.');
                            return;
                        }
                        try {
                            const response = await api.delete(`/favoritos/${fav_id}`, {
                                data: { usuario_id: usuarioId }
                            });
                            if (response.data.sucesso) {
                                const novaLista = favoritos.filter(item => item.fav_id !== fav_id);
                                setFavoritos(novaLista);
                            } else {
                                Alert.alert('Erro', response.data.mensagem || 'Não foi possível remover o favorito.');
                            }
                        } catch (error) {
                            const mensagem = error.response?.data?.mensagem || 'Ocorreu um erro ao remover. Tente novamente.';
                            Alert.alert('Erro na Requisição', mensagem);
                        }
                    }
                }
            ]
        );
    };

    // --- renderProduto ---
    const renderProduto = ({ item }) => {

        const imageSource = item.med_imagem
            ? { uri: item.med_imagem }
            : require('../../../public/alergia.png');

        const promo = calcularPrecoPromocional(item);

        return (
            <TouchableOpacity
                style={[styles.produtoCard, promo.estaEmPromocao && styles.produtoCardEmPromocao]}
                onPress={() => navigation.navigate('Produto', { produto: item })}
            >
                {promo.estaEmPromocao && (
                    <View style={styles.promoBadge}>
                        <Text style={styles.promoBadgeTexto}>{promo.descontoPorcento}% OFF</Text>
                    </View>
                )}

                {/* --- CORREÇÃO AQUI --- */}
                {/* O ícone agora é um coração, para mostrar que "está favoritado" */}
                {/* A função 'removerFavorito' continua no 'onPress' */}
                <TouchableOpacity
                    style={styles.removerButton}
                    onPress={() => removerFavorito(item.fav_id, item.med_nome)}
                >
                    <Ionicons name="heart" size={18} color="#fff" />
                </TouchableOpacity>
                {/* ------------------- */}

                <View style={styles.produtoImagemContainer}>
                    <Image
                        source={imageSource}
                        style={styles.produtoImagem}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.produtoInfo}>
                    <Text style={styles.produtoNome} numberOfLines={2}>{item.med_nome}</Text>
                    <Text style={styles.produtoMarca}>{item.fabricante_nome}</Text>
                    <Text style={styles.produtoDosagem}>{item.med_dosagem}</Text>

                    {/* Bloco de Preço REMOVIDO */}
                </View>
            </TouchableOpacity>
        );
    };

    // (O resto do arquivo - if(loading), return(), etc. - continua igual)
    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Meus Favoritos</Text>
                </View>
                <View style={styles.vazioContainer}>
                    <ActivityIndicator size="large" color="#2c3e50" />
                    <Text style={[styles.vazioTexto, { marginTop: 10 }]}>Carregando...</Text>
                </View>
            </View>
        );
    }

    if (favoritos.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Meus Favoritos</Text>
                </View>
                <View style={styles.vazioContainer}>
                    <Text style={styles.vazioIcon}>❤️</Text>
                    <Text style={styles.vazioTexto}>
                        {usuarioId ? "Nenhum produto favoritado" : "Você não está logado"}
                    </Text>
                    <Text style={styles.vazioSubtexto}>
                        {usuarioId
                            ? "Os produtos que você favoritar aparecerão aqui"
                            : "Faça login para ver seus favoritos"}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Meus Favoritos</Text>
                <Text style={styles.subtitle}>{favoritos.length} produto(s) salvo(s)</Text>
            </View>
            <FlatList
                data={favoritos}
                renderItem={renderProduto}
                keyExtractor={item => item.fav_id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listaContainer}
                ListFooterComponent={<View style={styles.espacoFinal} />}
                numColumns={2}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={['#458B00']}
                    />
                }
            />
        </View>
    );
}