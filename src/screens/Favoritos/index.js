import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import styles from './styles';

export default function Favoritos() {
    const navigation = useNavigation();
    const [favoritos, setFavoritos] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const carregarFavoritos = async () => {
                const fav = await AsyncStorage.getItem('favoritos');
                setFavoritos(fav ? JSON.parse(fav) : []);
            };
            carregarFavoritos();
        }, [])
    );

    const removerFavorito = async (id, nome) => {
        const novaLista = favoritos.filter(item => item.id !== id);
        setFavoritos(novaLista);
        await AsyncStorage.setItem('favoritos', JSON.stringify(novaLista));
        Alert.alert('Removido', `${nome} foi removido dos favoritos`);
    };

    const renderProduto = ({ item }) => (
        <TouchableOpacity
            style={styles.produtoCard}
            onPress={() => navigation.navigate('Produto', { produto: item })}
        >
            <View style={styles.produtoImagem}>
                <Image
                    source={item.imagem || require('../../../public/alergia.png')}
                    style={styles.produtoImagem}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.produtoInfo}>
                <Text style={styles.produtoNome} numberOfLines={2}>{item.nome}</Text>
                <Text style={styles.produtoMarca}>{item.marca}</Text>
                <Text style={styles.produtoPreco}>{item.preco}</Text>
            </View>
            <TouchableOpacity
                style={styles.removerButton}
                onPress={() => removerFavorito(item.id, item.nome)}
            >
                <Text style={styles.removerIcon}>✕</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

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
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listaContainer}
                ListFooterComponent={<View style={styles.espacoFinal} />}
            />
        </View>
    );
}