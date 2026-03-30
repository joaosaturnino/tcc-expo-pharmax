import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
    RefreshControl,
    LayoutAnimation,
    Platform,
    UIManager
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import styles from './styles';

// Ativa animações no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Componente Skeleton (Loading Visual)
const SkeletonCard = () => (
    <View style={styles.skeletonCard}>
        <View style={{width: '100%', height: 90, backgroundColor: '#F1F5F9', borderRadius: 12, marginBottom: 12}} />
        <View style={{width: '80%', height: 14, backgroundColor: '#F1F5F9', borderRadius: 4, marginBottom: 6}} />
        <View style={{width: '50%', height: 10, backgroundColor: '#F1F5F9', borderRadius: 4}} />
    </View>
);

function calcularPrecoPromocional(item) {
    const precoOriginal = parseFloat(item.preco || item.medp_preco);
    const desconto = parseFloat(item.promo_desconto);

    if (isNaN(precoOriginal) || !desconto || desconto <= 0 || !item.promo_inicio || !item.promo_fim) {
        return { estaEmPromocao: false, descontoPorcento: 0 };
    }

    const hoje = new Date();
    const inicio = new Date(item.promo_inicio);
    const fim = new Date(item.promo_fim);
    hoje.setHours(0, 0, 0, 0); inicio.setHours(0, 0, 0, 0); fim.setHours(0, 0, 0, 0);

    const estaEmPromocao = (hoje >= inicio && hoje <= fim);
    return { estaEmPromocao, descontoPorcento: estaEmPromocao ? desconto : 0 };
}

export default function Favoritos() {
    const navigation = useNavigation();
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [usuarioId, setUsuarioId] = useState(null);

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
                idDoUsuario = usuario?.usu_id || usuario?.id;
                setUsuarioId(idDoUsuario);
            } catch (e) {
                setLoading(false);
                return;
            }
        }

        if (idDoUsuario) {
            try {
                const response = await api.get(`/favoritos/usuario/${idDoUsuario}`);
                if (response.data.sucesso) {
                    // Animação suave ao carregar
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setFavoritos(response.data.dados || []);
                } else {
                    setFavoritos([]);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) setFavoritos([]);
            } finally {
                setLoading(false);
            }
        }
    }, [usuarioId]);

    useFocusEffect(
        React.useCallback(() => { carregarFavoritos(); }, [carregarFavoritos])
    );

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await carregarFavoritos(true);
        setIsRefreshing(false);
    }, [carregarFavoritos]);

    const removerFavorito = async (fav_id, nome) => {
        Alert.alert(
            "Remover Item",
            `Tirar "${nome}" dos favoritos?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: async () => {
                        if (!usuarioId) return;
                        try {
                            const response = await api.delete(`/favoritos/${fav_id}`, { data: { usuario_id: usuarioId } });
                            if (response.data.sucesso) {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); // Animação de saída
                                setFavoritos(prev => prev.filter(item => item.fav_id !== fav_id));
                            }
                        } catch (error) {
                            Alert.alert('Erro', 'Falha ao remover.');
                        }
                    }
                }
            ]
        );
    };

    const renderProduto = ({ item }) => {
        const imageSource = (item.med_imagem && item.med_imagem.length > 5)
            ? { uri: item.med_imagem }
            : { uri: 'https://via.placeholder.com/150?text=Sem+Imagem' };

        const promo = calcularPrecoPromocional(item);

        return (
            <TouchableOpacity
                style={[styles.produtoCard, promo.estaEmPromocao && styles.produtoCardEmPromocao]}
                onPress={() => navigation.navigate('Produto', { produto: item })}
                activeOpacity={0.8}
            >
                {/* Promoção */}
                {promo.estaEmPromocao && (
                    <View style={styles.promoBadge}>
                        <Text style={styles.promoBadgeTexto}>{Math.floor(promo.descontoPorcento)}% OFF</Text>
                    </View>
                )}

                {/* Botão Remover (Lixeira) */}
                <TouchableOpacity
                    style={styles.removerButton}
                    onPress={() => removerFavorito(item.fav_id, item.med_nome)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="trash-outline" size={14} color="#EF4444" />
                </TouchableOpacity>

                {/* Imagem */}
                <View style={styles.produtoImagemContainer}>
                    <Image source={imageSource} style={styles.produtoImagem} resizeMode="contain" />
                </View>

                {/* Info */}
                <View style={styles.produtoInfo}>
                    <Text style={styles.produtoNome} numberOfLines={2}>{item.med_nome}</Text>
                    <Text style={styles.produtoMarca} numberOfLines={1}>{item.fabricante_nome || 'Laboratório'}</Text>
                    <Text style={styles.produtoDosagem}>{item.med_dosagem}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    // --- LOADING ---
    if (loading && !isRefreshing) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Favoritos</Text>
                    <Text style={styles.subtitle}>Carregando sua lista...</Text>
                </View>
                <View style={{flexDirection:'row', padding: 12}}>
                    <SkeletonCard />
                    <SkeletonCard />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Favoritos</Text>
                <Text style={styles.subtitle}>
                    {favoritos.length > 0 ? `${favoritos.length} itens salvos` : 'Sua lista está vazia'}
                </Text>
            </View>

            <FlatList
                data={favoritos}
                renderItem={renderProduto}
                keyExtractor={item => String(item.fav_id)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listaContainer}
                numColumns={2}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#458B00']} />
                }
                ListEmptyComponent={
                    <View style={styles.vazioContainer}>
                        <View style={styles.vazioIconBg}>
                            <Ionicons name="heart-dislike-outline" size={32} color="#94A3B8" />
                        </View>
                        <Text style={styles.vazioTexto}>Nada por aqui</Text>
                        <Text style={styles.vazioSubtexto}>
                            {usuarioId 
                                ? "Você ainda não favoritou nenhum medicamento. Navegue pelo app para encontrar ofertas." 
                                : "Faça login para ver e salvar seus favoritos em qualquer dispositivo."}
                        </Text>
                        
                        {/* Botão de Ação */}
                        <TouchableOpacity style={styles.btnExplorar} onPress={() => navigation.navigate('Home')}>
                            <Text style={styles.btnExplorarText}>Explorar Medicamentos</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
}