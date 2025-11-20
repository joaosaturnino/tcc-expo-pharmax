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
import api from '../../services/api'; // Certifique-se que o caminho da API está correto
import styles from './styles';

// --- HELPER: Lógica de Promoção ---
// Calcula se o item está em oferta baseado nas datas e no desconto
function calcularPrecoPromocional(item) {
    const precoOriginal = parseFloat(item.preco || item.medp_preco);
    const desconto = parseFloat(item.promo_desconto);

    // Validações de segurança para evitar erros matemáticos
    if (isNaN(precoOriginal) || !desconto || desconto <= 0 || !item.promo_inicio || !item.promo_fim) {
        return { estaEmPromocao: false, descontoPorcento: 0 };
    }

    // Normalização de datas (zera as horas para comparar apenas o dia)
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

export default function Favoritos() {
    const navigation = useNavigation();

    // ESTADOS
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [usuarioId, setUsuarioId] = useState(null);

    // --- BUSCA DE DADOS ---
    // useCallback evita que a função seja recriada a cada renderização
    const carregarFavoritos = useCallback(async (isRefresh = false) => {
        if (!isRefresh) setLoading(true);

        let idDoUsuario = usuarioId;

        // 1. Se não temos o ID na memória, buscamos no Storage do celular
        if (!idDoUsuario) {
            try {
                const userData = await AsyncStorage.getItem('usuario_info');
                if (!userData) {
                    // Se não tiver usuário logado, paramos aqui
                    setLoading(false);
                    setFavoritos([]);
                    return;
                }
                const usuario = JSON.parse(userData);
                idDoUsuario = usuario?.usu_id;
                setUsuarioId(idDoUsuario); // Salva no estado para usar depois
            } catch (e) {
                console.error("Erro ao ler AsyncStorage", e);
                setLoading(false);
                return;
            }
        }

        // 2. Chamada à API
        if (idDoUsuario) {
            try {
                const response = await api.get(`/favoritos/usuario/${idDoUsuario}`);
                if (response.data.sucesso) {
                    setFavoritos(response.data.dados || []);
                } else {
                    // Em alguns casos a API retorna sucesso: false se a lista estiver vazia
                    setFavoritos([]);
                }
            } catch (error) {
                // Não alertamos erro se for apenas "404 - Nenhum favorito", apenas limpamos a lista
                if (error.response && error.response.status === 404) {
                    setFavoritos([]);
                } else {
                    Alert.alert('Aviso', 'Não foi possível atualizar a lista de favoritos.');
                }
            } finally {
                setLoading(false);
            }
        }
    }, [usuarioId]);

    // useFocusEffect: Recarrega a lista toda vez que a tela ganha foco (o usuário entra nela)
    useFocusEffect(
        React.useCallback(() => {
            carregarFavoritos();
        }, [carregarFavoritos])
    );

    // Função para o "Puxar para Atualizar"
    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await carregarFavoritos(true);
        setIsRefreshing(false);
    }, [carregarFavoritos]);

    // --- REMOÇÃO DE FAVORITO ---
    const removerFavorito = async (fav_id, nome) => {
        Alert.alert(
            "Remover Favorito",
            `Deseja remover "${nome}"?`,
            [
                { text: "Não", style: "cancel" },
                {
                    text: "Sim, remover",
                    style: "destructive",
                    onPress: async () => {
                        if (!usuarioId) return;

                        try {
                            // Axios DELETE com corpo (body) precisa da chave 'data'
                            const response = await api.delete(`/favoritos/${fav_id}`, {
                                data: { usuario_id: usuarioId }
                            });

                            if (response.data.sucesso) {
                                // ATUALIZAÇÃO OTIMISTA: Remove da lista visualmente antes de recarregar
                                setFavoritos(prev => prev.filter(item => item.fav_id !== fav_id));
                            } else {
                                Alert.alert('Erro', response.data.mensagem);
                            }
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível remover o item.');
                        }
                    }
                }
            ]
        );
    };

    // --- RENDERIZAÇÃO DO CARD ---
    const renderProduto = ({ item }) => {
        // Tratamento de Imagem Seguro:
        // Usa uma imagem remota padrão se a do produto falhar ou não existir.
        // Evita usar require() com caminhos complexos que podem quebrar o Expo.
        const imageSource = (item.med_imagem && item.med_imagem.length > 5)
            ? { uri: item.med_imagem }
            : { uri: 'https://via.placeholder.com/150?text=Sem+Imagem' }; // URL Placeholder segura

        const promo = calcularPrecoPromocional(item);

        return (
            <TouchableOpacity
                style={[styles.produtoCard, promo.estaEmPromocao && styles.produtoCardEmPromocao]}
                onPress={() => navigation.navigate('Produto', { produto: item })}
                activeOpacity={0.7}
            >
                {/* Etiqueta de Promoção */}
                {promo.estaEmPromocao && (
                    <View style={styles.promoBadge}>
                        <Text style={styles.promoBadgeTexto}>{promo.descontoPorcento}% OFF</Text>
                    </View>
                )}

                {/* Botão de Remover (Coração) */}
                <TouchableOpacity
                    style={styles.removerButton}
                    onPress={() => removerFavorito(item.fav_id, item.med_nome)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Aumenta a área de toque
                >
                    {/* Ícone de lixeira seria o padrão UX para remover, mas mantive o coração conforme pedido */}
                    <Ionicons name="heart" size={18} color="#fff" />
                </TouchableOpacity>

                {/* Imagem */}
                <View style={styles.produtoImagemContainer}>
                    <Image
                        source={imageSource}
                        style={styles.produtoImagem}
                        resizeMode="contain"
                    />
                </View>

                {/* Informações */}
                <View style={styles.produtoInfo}>
                    <Text style={styles.produtoNome} numberOfLines={2}>{item.med_nome}</Text>
                    <Text style={styles.produtoMarca} numberOfLines={1}>{item.fabricante_nome || 'Laboratório'}</Text>
                    <Text style={styles.produtoDosagem}>{item.med_dosagem}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    // --- LOADING ---
    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Meus Favoritos</Text>
                </View>
                <View style={styles.vazioContainer}>
                    <ActivityIndicator size="large" color="#458B00" />
                    <Text style={[styles.vazioTexto, { marginTop: 10 }]}>Carregando...</Text>
                </View>
            </View>
        );
    }

    // --- LISTA VAZIA ---
    if (favoritos.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Meus Favoritos</Text>
                </View>
                <View style={styles.vazioContainer}>
                    <Text style={styles.vazioIcon}>❤️</Text>
                    <Text style={styles.vazioTexto}>
                        {usuarioId ? "Nenhum favorito ainda" : "Faça login"}
                    </Text>
                    <Text style={styles.vazioSubtexto}>
                        {usuarioId
                            ? "Salve seus medicamentos preferidos para acesso rápido."
                            : "Entre na sua conta para ver seus favoritos salvos."}
                    </Text>
                </View>
            </View>
        );
    }

    // --- LISTA COM DADOS ---
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Meus Favoritos</Text>
                <Text style={styles.subtitle}>{favoritos.length} itens salvos</Text>
            </View>

            <FlatList
                data={favoritos}
                renderItem={renderProduto}
                keyExtractor={item => String(item.fav_id)} // Converte ID para string para evitar warnings
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listaContainer}
                numColumns={2} // Grade de 2 colunas
                ListFooterComponent={<View style={styles.espacoFinal} />}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={['#458B00']} // Cor verde do tema
                    />
                }
            />
        </View>
    );
}