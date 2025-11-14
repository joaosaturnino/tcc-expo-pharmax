import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import api from '../../services/api'; 
import styles from './styles';

export default function Favoritos() {
    const navigation = useNavigation();
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(false);

    // Este ID deve ser dinâmico, vindo do estado de login do usuário
    const USUARIO_ID = 1;

    useFocusEffect(
        React.useCallback(() => {
            const carregarFavoritos = async () => {
                setLoading(true);
                try {
                    const response = await api.get(`/favoritos/usuario/${USUARIO_ID}`);

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
            };
            carregarFavoritos();
        }, [])
    );

    const removerFavorito = async (fav_id, nome) => {
        try {
            // --- CORREÇÃO APLICADA ---
            // Enviando o 'usuario_id' no corpo, conforme a nova lógica do backend.
            const response = await api.delete(`/favoritos/${fav_id}`, {
                data: { usuario_id: USUARIO_ID } 
            });

            if (response.data.sucesso) {
                const novaLista = favoritos.filter(item => item.fav_id !== fav_id);
                setFavoritos(novaLista);
                Alert.alert('Removido', `${nome} foi removido dos favoritos.`);
            } else {
                Alert.alert('Erro', response.data.mensagem || 'Não foi possível remover o favorito.');
            }
        } catch (error) {
            const mensagem = error.response?.data?.mensagem || 'Ocorreu um erro ao remover. Tente novamente.';
            Alert.alert('Erro na Requisição', mensagem);
        }
    };

    const renderProduto = ({ item }) => {
        
        // --- CORREÇÃO APLICADA ---
        // Lendo 'item.med_imagem_url' (enviado pelo backend) em vez de 'item.med_imagem'.
        const imageSource = item.med_imagem_url
            ? { uri: item.med_imagem_url } 
            : require('../../../public/alergia.png');

        return (
            <TouchableOpacity
                style={styles.produtoCard}
                onPress={() => navigation.navigate('Produto', { produto: item })}
            >
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
                </View>
                <TouchableOpacity
                    style={styles.removerButton}
                    // Passando os parâmetros corretos (não precisa mais do farmacia_id aqui)
                    onPress={() => removerFavorito(item.fav_id, item.med_nome)}
                >
                    <Text style={styles.removerIcon}>✕</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };
    
    if (loading) {
        return (
             <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Meus Favoritos</Text>
                </View>
                <View style={styles.vazioContainer}>
                    <Text style={styles.vazioTexto}>Carregando...</Text>
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
                    <Text style={styles.vazioTexto}>Nenhum produto favoritado</Text>
                    <Text style={styles.vazioSubtexto}>
                        Os produtos que você favoritar aparecerão aqui
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
            />
        </View>
    );
}
// --- CORREÇÃO DE SINTAXE APLICADA ---
// Chave extra removida