import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

export default function Home() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  // Categorias com imagens
  const categorias = [
    { id: '1', nome: 'Antialérgicos', imagem: require('../../../public/alergia.png') },
    { id: '2', nome: 'Analgésicos', imagem: require('../../../public/dor-de-cabeca.png') },
    { id: '3', nome: 'Vitaminas', imagem: require('../../../public/vitaminas.png') },
    { id: '4', nome: 'Antibióticos', imagem: require('../../../public/antibiotico.png') },
  ];

  // Produtos com imagens - ADICIONE A IMAGEM EM CADA PRODUTO
  const produtosPromocao = [
    { 
      id: '1', 
      nome: 'Paracetamol', 
      preco: 'R$ 15,00', 
      marca: 'Medley', 
      categoria: 'Analgésicos',
      imagem: require('../../../public/paracetamol.png') // Adicione a imagem
    },
    { 
      id: '2', 
      nome: 'Dipirona', 
      preco: 'R$ 12,50', 
      marca: 'Neo Química', 
      categoria: 'Analgésicos',
      imagem: require('../../../public/dipirona.png') // Adicione a imagem
    },
    { 
      id: '3', 
      nome: 'Omeprazol', 
      preco: 'R$ 18,90', 
      marca: 'EMS', 
      categoria: 'Vitaminas',
      imagem: require('../../../public/omeprazol.png') // Adicione a imagem
    },
    { 
      id: '4', 
      nome: 'Ibuprofeno', 
      preco: 'R$ 14,75', 
      marca: 'Eurofarma', 
      categoria: 'Analgésicos',
      imagem: require('../../../public/ibuprofeno.png') // Adicione a imagem
    },
    { 
      id: '5', 
      nome: 'Loratadina', 
      preco: 'R$ 9,90', 
      marca: 'Aché', 
      categoria: 'Antialérgicos',
      imagem: require('../../../public/loratadina.png') // Adicione a imagem
    },
    { 
      id: '6', 
      nome: 'Amoxilina', 
      preco: 'R$ 22,00', 
      marca: 'Novartis', 
      categoria: 'Antibióticos',
      imagem: require('../../../public/amoxilina.png') // Adicione a imagem
    },
  ];

  const marcas = [
    { id: '1', nome: 'Cimed', logo: require('../../../public/cimed.png') },
    { id: '2', nome: 'EuroPharma', logo: require('../../../public/europharma.png') },
    { id: '3', nome: 'Ems', logo: require('../../../public/ems.png') },
    { id: '4', nome: 'Medley', logo: require('../../../public/medley.png') },
  ];

  const farmaciasPopulares = [
    {
      id: '1',
      nome: 'Drogasil',
      banner: require('../../../public/drogasil.png'),
    },
    {
      id: '2',
      nome: 'Pague Menos',
      banner: require('../../../public/paguemenos.png'),
    },
    {
      id: '3',
      nome: 'Drogaria São Paulo',
      banner: require('../../../public/drogariasaopaulo.png'),
    },
  ];

  // Renderizar Categoria
  const renderCategoria = ({ item }) => (
    <TouchableOpacity
      style={styles.categoriaItem}
      onPress={() => navigation.navigate('Categoria', { nome: item.nome, medicamentos: produtosPromocao })}
    >
      <Image source={item.imagem} style={styles.categoriaIcon} resizeMode="contain" />
      <Text style={styles.categoriaNome}>{item.nome}</Text>
    </TouchableOpacity>
  );

  // Renderizar Produto - ATUALIZADO PARA USAR IMAGEM
  const renderProduto = ({ item }) => (
    <TouchableOpacity 
      style={styles.produtoCard}
      onPress={() => navigation.navigate('Produto', { produto: item })}
    >
      <View style={styles.produtoImagem}>
        {/* USANDO IMAGEM REAL EM VEZ DE EMOJI */}
        <Image source={item.imagem} style={styles.produtoImagemReal} resizeMode="contain" />
      </View>
      <Text style={styles.produtoNome} numberOfLines={1}>{item.nome}</Text>
      <Text style={styles.produtoMarca}>{item.marca}</Text>
      <Text style={styles.produtoPreco}>{item.preco}</Text>
    </TouchableOpacity>
  );

  // Renderizar Laboratório
  const renderLaboratorio = ({ item }) => (
    <TouchableOpacity
      style={styles.marcaCard}
      onPress={() => navigation.navigate('Laboratorio', { nome: item.nome, medicamentos: produtosPromocao, imagemLaboratorio: item.logo })}
    >
      <View style={styles.marcaLogo}>
        <Image source={item.logo} style={styles.marcaLogoImagem} resizeMode="contain" />
      </View>
      <Text style={styles.marcaNome}>{item.nome}</Text>
    </TouchableOpacity>
  );

  // Renderizar Banner Farmácia
  const renderBannerFarmacia = ({ item }) => (
    <TouchableOpacity
      style={styles.bannerFarmaciaCard}
      onPress={() => navigation.navigate('Farmacia', { nome: item.nome, medicamentos: produtosPromocao, imagemFarmacia: item.banner })}
    >
      <Image source={item.banner} style={styles.bannerFarmaciaImagem} resizeMode="cover" />
      <Text style={styles.bannerFarmaciaNome}>{item.nome}</Text>
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
          source={require('../../../public/LogoEscrita2.png')}
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

        {/* Farmácias Populares */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farmácias Populares</Text>
          <FlatList
            data={farmaciasPopulares}
            renderItem={renderBannerFarmacia}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.marcasList}
          />
        </View>

        {/* Laboratórios Populares */}
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

        {/* Espaço no final */}
        <View style={styles.espacoFinal} />
      </ScrollView>
    </View>
  );
}