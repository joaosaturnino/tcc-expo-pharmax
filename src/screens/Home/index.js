import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';


const renderMarca = ({ item }) => (
  <TouchableOpacity
    style={styles.marcaCard}
    onPress={() => navigation.navigate('Laboratorio', { 
      nome: item.nome, 
      medicamentos: produtosPromocao 
    })}
  >
    <View style={styles.marcaLogo}>
      <Text style={styles.marcaLogoTexto}>{item.logo}</Text>
    </View>
    <Text style={styles.marcaNome}>{item.nome}</Text>
  </TouchableOpacity>
);


export default function Home() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  

  // Categorias com imagens (ajuste os caminhos conforme sua pasta)
  const categorias = [
    { id: '1', nome: 'Antialérgicos', imagem: require('../../../public/alergia.png') },
    { id: '2', nome: 'Analgésicos', imagem: require('../../../public/dor-de-cabeca.png') },
    { id: '3', nome: 'Vitaminas', imagem: require('../../../public/vitaminas.png') },
    { id: '4', nome: 'Antibióticos', imagem: require('../../../public/antibiotico.png') },
  ];

  const produtosPromocao = [
    { id: '1', nome: 'Paracetamol', preco: 'R$ 15,00', marca: 'Medley', categoria: 'Analgésicos' },
    { id: '2', nome: 'Dipirona', preco: 'R$ 12,50', marca: 'Neo Química', categoria: 'Analgésicos' },
    { id: '3', nome: 'Omeprazol', preco: 'R$ 18,90', marca: 'EMS', categoria: 'Vitaminas' },
    { id: '4', nome: 'Ibuprofeno', preco: 'R$ 14,75', marca: 'Eurofarma', categoria: 'Analgésicos' },
    { id: '5', nome: 'Loratadina', preco: 'R$ 9,90', marca: 'Aché', categoria: 'Antialérgicos' },
    { id: '6', nome: 'Amoxilina', preco: 'R$ 22,00', marca: 'Novartis', categoria: 'Antibióticos' },
  ];

  const marcas = [
    { id: '1', nome: 'Cimed', logo: 'P' },
    { id: '2', nome: 'EuroPharma', logo: 'G' },
    { id: '3', nome: 'NeoQuímica', logo: 'Z' },
    { id: '4', nome: 'Generico', logo: 'H' },
  ];

  // Ao clicar na categoria, navega para a tela Categoria passando o nome
  const renderCategoria = ({ item }) => (
    <TouchableOpacity
      style={styles.categoriaItem}
      onPress={() => navigation.navigate('Categoria', { nome: item.nome, medicamentos: produtosPromocao })}
    >
      <Image source={item.imagem} style={styles.categoriaIcon} resizeMode="contain" />
      <Text style={styles.categoriaNome}>{item.nome}</Text>
    </TouchableOpacity>
  );
function handlePesquisar() {
  const resultado = produtosPromocao.find(p => 
    p.nome.toLowerCase().includes(searchText.trim().toLowerCase())
  );
  if (resultado) {
    navigation.navigate('Produto', { produto: resultado });
  } else {
    // Exibir alerta ou mensagem de não encontrado
  }
}
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

  const renderLaboratorio = ({ item }) => (
    <TouchableOpacity
      style={styles.marcaCard}
      onPress={() => navigation.navigate('Laboratorio', { nome: item.nome, medicamentos: produtosPromocao })}
    >
      <View style={styles.marcaLogo}>
        <Text style={styles.marcaLogoTexto}>{item.logo}</Text>
      </View>
      <Text style={styles.marcaNome}>{item.nome}</Text>
    </TouchableOpacity>
  );

   const renderFarmacia = ({ item }) => (
    <TouchableOpacity
      style={styles.marcaCard}
      onPress={() => navigation.navigate('Farmacia', { nome: item.nome, medicamentos: produtosPromocao })}
    >
      <View style={styles.marcaLogo}>
        <Text style={styles.marcaLogoTexto}>{item.logo}</Text>
      </View>
      <Text style={styles.marcaNome}>{item.nome}</Text>
    </TouchableOpacity>
  );

  // Pesquisa
  function handlePesquisar() {
    if (searchText.trim().length > 0) {
      navigation.navigate('Pesquisa', {
        termo: searchText,
        produtos: produtosPromocao,
      });
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../../public/LogoEscrita.png')} // ajuste o caminho conforme sua logo
          style={styles.logo}
        />
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar produto..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handlePesquisar}
          returnKeyType="search"
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

        {/* laboratorios Populares */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Laboratórios Populares</Text>
          <FlatList
            data={marcas}
            renderItem={renderLaboratorio}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.marcasList}
          />
        </View>
        {/* farmacias Populares */}

         <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farmácias Populares</Text>
          <FlatList
            data={marcas}
            renderItem={renderFarmacia}
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