import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFavoritos } from './FavoritosContext';
import styles from './styles';

export default function Favoritos() {
    const navigation = useNavigation();
    const { favoritos, removerFavorito, limparFavoritos } = useFavoritos();

    const handleRemoverFavorito = (id, nome) => {
        removerFavorito(id);
        Alert.alert('Removido', `${nome} foi removido dos favoritos`);
    };

    const handleLimparFavoritos = () => {
        Alert.alert(
            'Limpar Favoritos',
            'Deseja remover todos os produtos dos favoritos?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Limpar', 
                    style: 'destructive',
                    onPress: () => {
                        limparFavoritos();
                        Alert.alert('Sucesso', 'Todos os favoritos foram removidos');
                    }
                }
            ]
        );
    };

    const renderProduto = ({ item }) => (
        <TouchableOpacity 
            style={styles.produtoCard}
            onPress={() => navigation.navigate('Produto', { produto: item })}
        >
            <View style={styles.produtoImagemContainer}>
                <Image
                    source={item.imagem || require('../../../public/logo.png')}
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
                onPress={() => handleRemoverFavorito(item.id, item.nome)}
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
                    <TouchableOpacity 
                        style={styles.botaoExplorar}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.botaoExplorarTexto}>Explorar Produtos</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Meus Favoritos</Text>
                    <Text style={styles.subtitle}>{favoritos.length} produto(s) salvo(s)</Text>
                </View>
                {favoritos.length > 0 && (
                    <TouchableOpacity onPress={handleLimparFavoritos}>
                        <Text style={styles.limparTexto}>Limpar</Text>
                    </TouchableOpacity>
                )}
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