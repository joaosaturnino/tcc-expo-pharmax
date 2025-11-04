import { useState, useEffect, use } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import api from '../../services/api';

export default function Home() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [farmaciasPopulares, setFarmaciasPopulares] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]); // novo estado para laboratórios
  const [loadingLaboratorios, setLoadingLaboratorios] = useState(false); // opcional
  const [ tipo, setTipo ] = useState(3);

  useEffect(() => {
    fetchFarmaciasPopulares();
    fetchLaboratorios();

  }, []);



  async function fetchFarmaciasPopulares() {
    try {
      const response = await api.get('/farmacias?qtde=4');
      setFarmaciasPopulares(response.data.dados);
    } catch (error) {
      console.error('Erro ao buscar farmácias populares:', error);
    }
  }




  // nova função para buscar laboratórios
  async function fetchLaboratorios() {
    try {
      const response = await api.get('/laboratorios?qtde=4'); // mesma forma que farmacias
      const dados = response?.data?.dados ?? response?.data ?? [];

      // normaliza para lab_logo_url (igual farmacias usa farm_logo_url)
      const mapped = Array.isArray(dados)
        ? dados.map(item => {
            const url =
              item.lab_logo_url ??
              item.logo_url ??
              item.logo ??
              item.imagem_url ??
              // item.imagem ??
              item.lab_logo ??
              null;

            return {
              ...item,
              lab_logo_url: typeof url === 'string' && url.length ? url : null,
            };
          })
        : [];

      setLaboratorios(mapped);
    } catch (error) {
      console.error('Erro ao buscar laboratórios:', error);
      setLaboratorios([]);
    }
  }

  // Categorias com imagens
  const categorias = [
    { id: '1', nome: 'Antialérgicos', imagem: require('../../../public/alergia.png') },
    { id: '2', nome: 'Analgésicos', imagem: require('../../../public/dor-de-cabeca.png') },
    { id: '3', nome: 'Vitaminas', imagem: require('../../../public/vitaminas.png') },
    { id: '4', nome: 'Antibióticos', imagem: require('../../../public/antibiotico.png') },
  ];

  // Produtos com imagens
  const produtosPromocao = [
    {
      id: '1',
      nome: 'Paracetamol',
      preco: 'R$ 15,00',
      marca: 'Medley',
      categoria: 'Analgésicos',
      imagem: require('../../../public/paracetamol.png')
    },
    {
      id: '2',
      nome: 'Dipirona',
      preco: 'R$ 12,50',
      marca: 'Neo Química',
      categoria: 'Analgésicos',
      imagem: require('../../../public/dipirona.png')
    },
    {
      id: '3',
      nome: 'Omeprazol',
      preco: 'R$ 18,90',
      marca: 'EMS',
      categoria: 'Vitaminas',
      imagem: require('../../../public/omeprazol.png')
    },
    {
      id: '4',
      nome: 'Ibuprofeno',
      preco: 'R$ 14,75',
      marca: 'Eurofarma',
      categoria: 'Analgésicos',
      imagem: require('../../../public/ibuprofeno.png')
    },
    {
      id: '5',
      nome: 'Loratadina',
      preco: 'R$ 9,90',
      marca: 'Aché',
      categoria: 'Antialérgicos',
      imagem: require('../../../public/loratadina.png')
    },
    {
      id: '6',
      nome: 'Amoxilina',
      preco: 'R$ 22,00',
      marca: 'Novartis',
      categoria: 'Antibióticos',
      imagem: require('../../../public/amoxilina.png')
    },
  ];

  const marcas = [
    { lab_id: '1', lab_nome: 'Cimed', lab_logo: require('../../../public/cimed.png') },
    { lab_id: '2', lab_nome: 'EuroPharma', lab_logo: require('../../../public/europharma.png') },
    { lab_id: '3', lab_nome: 'Ems', lab_logo: require('../../../public/ems.png') },
    { lab_id: '4', lab_nome: 'Medley', lab_logo: require('../../../public/medley.png') },
  ];

  // Renderizar Categoria
  const renderCategoria = ({ item }) => (
    <TouchableOpacity
      style={styles.categoriaItem}
      onPress={() => navigation.navigate('Categoria', { nome: item.nome, medicamentos: produtosPromocao, tipo:tipo })}
    >
      <Image source={item.imagem} style={styles.categoriaIcon} resizeMode="contain" />
      <Text style={styles.categoriaNome}>{item.nome}</Text>
    </TouchableOpacity>
  );

  // Renderizar Produto
  const renderProduto = ({ item }) => (
    <TouchableOpacity
      style={styles.produtoCard}
      onPress={() => navigation.navigate('Produto', { produto: item })}
    >
      <View style={styles.produtoImagem}>
        <Image source={item.imagem} style={styles.produtoImagemReal} resizeMode="contain" />
      </View>
      <Text style={styles.produtoNome} numberOfLines={1}>{item.nome}</Text>
      <Text style={styles.produtoMarca}>{item.marca}</Text>
      <Text style={styles.produtoPreco}>{item.preco}</Text>
    </TouchableOpacity>
  );

  // Renderizar Laboratório (usa lab_logo_url como farmacias usa farm_logo_url)
  const renderLaboratorio = ({ item }) => {
    const imageSource =
      typeof item.lab_logo_url === 'string' && item.lab_logo_url.startsWith('http')
        ? { uri: item.lab_logo_url }
        : // se não houver lab_logo_url, tenta campos locais (require) ou fallback
          (item.lab_logo && (typeof item.lab_logo === 'string' ? { uri: item.lab_logo_url } : item.lab_logo)) ||
          require('../../../public/cimed.png');

    return (
      <TouchableOpacity
        style={styles.marcaCard}
        onPress={() =>
          navigation.navigate('Laboratorio', {
            nome: item.lab_nome || item.nome,
            medicamentos: produtosPromocao,
            imagemLaboratorio: item.lab_logo_url || item.lab_logo,
          })
        }
      >
        <View style={styles.marcaLogo}>
          <Image source={imageSource} style={styles.marcaLogoImagem} resizeMode="contain" />
        </View>
        <Text style={styles.marcaNome}>{item.lab_nome || item.nome}</Text>
      </TouchableOpacity>
    );
  };

  // Renderizar Banner Farmácia - NA HOME
  const renderBannerFarmacia = ({ item }) => {
    const imageSource = typeof item.farm_logo_url === 'string'
      ? { uri: item.farm_logo_url }
      : item.farm_logo_url;

    return (
      <TouchableOpacity
        style={styles.bannerFarmaciaCard}
        key={item.farm_id || item.id}
        onPress={() => navigation.navigate('Farmacia', {
          nome: item.farm_nome,
          medicamentos: produtosPromocao,
          imagemFarmacia: item.farm_logo_url
        })}
      >
        <Image source={imageSource} style={styles.bannerFarmaciaImagem} resizeMode="stretch" />
        <Text style={styles.bannerFarmaciaNome}>{item.farm_nome}</Text>
      </TouchableOpacity>
    );
  };

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
            keyExtractor={item => item.farm_id || item.id || String(item.farm_nome)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.marcasList}
          />
        </View>

        {/* Laboratórios Populares */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Laboratórios Populares</Text>
          <FlatList
            data={laboratorios.length ? laboratorios : marcas} // usa dados da API com fallback para `marcas`
            renderItem={renderLaboratorio}
            keyExtractor={item => item.lab_id || item.id || String(item.lab_nome || item.nome)}
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