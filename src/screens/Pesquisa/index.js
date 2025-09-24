import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './styles';

// Exemplo de medicamentos
const produtosPromocao = [
  { id: '1', nome: 'Paracetamol', preco: 'R$ 15,00', marca: 'Medley', categoria: 'Analgésicos', descricao: 'Analgésico para dor e febre.' },
  { id: '2', nome: 'Dipirona', preco: 'R$ 12,50', marca: 'Neo Química', categoria: 'Analgésicos', descricao: 'Alívio de dores e febre.' },
  { id: '3', nome: 'Loratadina', preco: 'R$ 9,90', marca: 'Aché', categoria: 'Antialérgicos', descricao: 'Antialérgico para rinite e alergias.' },
  { id: '4', nome: 'Amoxilina', preco: 'R$ 22,00', marca: 'Novartis', categoria: 'Antibióticos', descricao: 'Antibiótico para infecções.' },
  { id: '5', nome: 'Vitamina C', preco: 'R$ 8,50', marca: 'EMS', categoria: 'Vitaminas', descricao: 'Suplemento de vitamina C.' },
];

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

    // Adicione este renderCategoria na Home
    const renderCategoria = ({ item }) => {
      // Filtra o primeiro medicamento da categoria
      const produto = produtosPromocao.find(prod => prod.categoria === item.nome);

      return (
        <TouchableOpacity
          style={styles.categoriaItem}
          onPress={() => {
            if (produto) {
              navigation.navigate('Produto', { produto });
            }
          }}
        >
          <Image source={item.imagem} style={styles.categoriaIcon} resizeMode="contain" />
          <Text style={styles.categoriaNome}>{item.nome}</Text>
        </TouchableOpacity>
      );
    };

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

            {/* Categorias - Adicionado na tela de pesquisa */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Categorias</Text>
                <FlatList
                    data={categorias}
                    renderItem={renderCategoria}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
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