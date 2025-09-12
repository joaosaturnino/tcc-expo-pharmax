import { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';

export default function Home() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  // Dados das categorias
  const categorias = [
    { id: '1', nome: 'Antialérgicos', icon: '💊' },
    { id: '2', nome: 'Analgésicos', icon: '💊' },
    { id: '3', nome: 'Vitaminas', icon: '💊' },
    { id: '4', nome: 'Antibióticos', icon: '💊' },
  ];

  // Produtos em promoção
  const produtosPromocao = [
    { id: '1', nome: 'Paracetamol', preco: 'R$ 15,00', marca: 'Medley' },
    { id: '2', nome: 'Dipirona', preco: 'R$ 12,50', marca: 'Neo Química' },
    { id: '3', nome: 'Omeprazol', preco: 'R$ 18,90', marca: 'EMS' },
    { id: '4', nome: 'Ibuprofeno', preco: 'R$ 14,75', marca: 'Eurofarma' },
    { id: '5', nome: 'Loratadina', preco: 'R$ 9,90', marca: 'Aché' },
    { id: '6', nome: 'Amoxilina', preco: 'R$ 22,00', marca: 'Novartis' },
  ];

  // Marcas populares
  const marcas = [
    { id: '1', nome: 'Pampers', logo: 'P' },
    { id: '2', nome: 'GIN1B', logo: 'G' },
    { id: '3', nome: 'ZERSTEI', logo: 'Z' },
    { id: '4', nome: 'HUGEIES', logo: 'H' },
  ];

  const renderCategoria = ({ item }) => (
    <TouchableOpacity style={styles.categoriaItem}>
      <Text style={styles.categoriaIcon}>{item.icon}</Text>
      <Text style={styles.categoriaNome}>{item.nome}</Text>
    </TouchableOpacity>
  );

  const renderProduto = ({ item }) => (
    <TouchableOpacity style={styles.produtoCard}>
      <View style={styles.produtoImagem}>
        <Text style={styles.produtoImagemTexto}>📦</Text>
      </View>
      <Text style={styles.produtoNome} numberOfLines={1}>{item.nome}</Text>
      <Text style={styles.produtoMarca}>{item.marca}</Text>
      <Text style={styles.produtoPreco}>{item.preco}</Text>
    </TouchableOpacity>
  );

  const renderMarca = ({ item }) => (
    <TouchableOpacity style={styles.marcaCard}>
      <View style={styles.marcaLogo}>
        <Text style={styles.marcaLogoTexto}>{item.logo}</Text>
      </View>
      <Text style={styles.marcaNome}>{item.nome}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pharma</Text>
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Hinted search text"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categorias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <FlatList
            data={categorias}
            renderItem={renderCategoria}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriasList}
          />
        </View>

        {/* Promoção */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Destaques</Text>
            <TouchableOpacity>
              <Text style={styles.verTudo}>Todas</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={produtosPromocao}
            renderItem={renderProduto}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.produtosList}
          />
        </View>

        {/* Marcas Populares */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marcas Populares</Text>
          <FlatList
            data={marcas}
            renderItem={renderMarca}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.marcasList}
          />
        </View>

        {/* Espaço no final */}
        <View style={styles.espacoFinal} />
      </ScrollView>
    </View>
  );
}