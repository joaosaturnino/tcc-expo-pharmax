import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './styles';

export default function Pesquisa() {
    const navigation = useNavigation();
    const route = useRoute();
    const { termo = '', produtos = [] } = route.params || {};

    const [searchText, setSearchText] = useState(termo);

    const resultados = produtos.filter(item =>
        item.nome.toLowerCase().includes(searchText.toLowerCase())
    );

    const renderProduto = ({ item }) => (
        <TouchableOpacity
            style={styles.produtoCard}
            onPress={() => navigation.navigate('Produto', { produto: item })}
        >
            <View style={styles.produtoImagem}>
                <Text style={styles.produtoImagemTexto}>📦</Text>
            </View>
            <Text style={styles.produtoNome} numberOfLines={1}>{item.nome}</Text>
            <Text style={styles.produtoMarca}>{item.marca}</Text>
            <Text style={styles.produtoPreco}>{item.preco}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Resultados da Pesquisa</Text>
            </View>

            {/* Botão Voltar */}
            <TouchableOpacity
                style={{
                    margin: 16,
                    backgroundColor: '#3498db',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                }}
                onPress={() => navigation.goBack()}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Voltar para Home</Text>
            </TouchableOpacity>

            {/* Barra de Pesquisa */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar produto..."
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {/* Resultados */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    {resultados.length > 0
                        ? `Encontrados ${resultados.length} produtos`
                        : 'Nenhum produto encontrado'}
                </Text>
                <FlatList
                    data={resultados}
                    renderItem={renderProduto}
                    keyExtractor={item => item.id}
                    horizontal={false}
                    numColumns={2}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}