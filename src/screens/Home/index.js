import { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Image, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import api from '../../services/api';

// --- Função Helper de Promoção ---
function calcularPrecoPromocional(item) {
  const precoOriginal = parseFloat(item.preco || item.medp_preco);
  const desconto = parseFloat(item.promo_desconto);
  if (isNaN(precoOriginal) || !desconto || desconto <= 0 || !item.promo_inicio || !item.promo_fim) {
    return { precoOriginal: isNaN(precoOriginal) ? ' --,--' : precoOriginal.toFixed(2).replace('.', ','), precoComDesconto: null, estaEmPromocao: false, descontoPorcento: 0 };
  }
  const hoje = new Date();
  const inicio = new Date(item.promo_inicio);
  const fim = new Date(item.promo_fim);
  hoje.setHours(0, 0, 0, 0);
  inicio.setHours(0, 0, 0, 0);
  fim.setHours(0, 0, 0, 0);
  const estaEmPromocao = (hoje >= inicio && hoje <= fim);
  if (estaEmPromocao) {
    const precoComDesconto = precoOriginal * (1 - desconto / 100);
    return { precoOriginal: precoOriginal.toFixed(2).replace('.', ','), precoComDesconto: precoComDesconto.toFixed(2).replace('.', ','), estaEmPromocao: true, descontoPorcento: desconto };
  }
  return { precoOriginal: precoOriginal.toFixed(2).replace('.', ','), precoComDesconto: null, estaEmPromocao: false, descontoPorcento: 0 };
}

export default function Home() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [farmaciasPopulares, setFarmaciasPopulares] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [produtosDestaque, setProdutosDestaque] = useState([]); 
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    fetchFarmaciasPopulares();
    fetchLaboratorios();
    fetchDestaques(); 
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchDestaques(),
        fetchFarmaciasPopulares(),
        fetchLaboratorios()
      ]);
    } catch (error) {
      console.error("Erro ao recarregar:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  async function fetchDestaques() {
    try {
      const response = await api.get('/medicamentos/todos?limit=20');
      const allDados = response?.data?.dados?.filter(item => item) ?? [];

      let shuffled = [...allDados];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      const dados = shuffled.slice(0, 4);
      setProdutosDestaque(dados);
    } catch (error) {
      console.error('Erro ao buscar destaques:', error);
      setProdutosDestaque([]);
    }
  }

  async function fetchFarmaciasPopulares() {
    try {
      const response = await api.get('/farmacias?qtde=4');
      const dados = response?.data?.dados?.filter(item => item) ?? [];
      setFarmaciasPopulares(dados);
    } catch (error) {
      console.error('Erro ao buscar farmácias populares:', error);
    }
  }

  async function fetchLaboratorios() {
    try {
      const response = await api.get('/laboratorios?qtde=4');
      let dados = response?.data?.dados?.filter(item => item) ?? response?.data?.filter(item => item) ?? [];
      const mapped = Array.isArray(dados)
        ? dados.map(item => {
            const url =
              item?.lab_logo_url ??
              item?.logo_url ??
              item?.logo ??
              item?.imagem_url ??
              item?.lab_logo ??
              null;
            return {
              ...item,
              lab_logo_url: typeof url === 'string' && url.length ? url : null,
            };
          })
        : [];
      setLaboratorios(mapped);
    } catch (error)
    {
      console.error('Erro ao buscar laboratórios:', error);
      setLaboratorios([]);
    }
  }

  // --- DADOS ESTÁTICOS ---
  const categorias = [
    { id: '4', nome: 'Antialérgicos', imagem: require('../../../public/alergia.png') },
    { id: '1', nome: 'Analgésicos', imagem: require('../../../public/dor-de-cabeca.png') },
    { id: '5', nome: 'Vitaminas', imagem: require('../../../public/vitaminas.png') },
    { id: '2', nome: 'Antibióticos', imagem: require('../../../public/antibiotico.png') }, 
    { id: '3', nome: 'Anti-inflamatório', imagem: require('../../../public/anti-inflamatorio.png') },
    { id: '11', nome: 'Cardiovascular', imagem: require('../../../public/coracao.png') },
    { id: '10', nome: 'Gastrointestinal', imagem: require('../../../public/trato-gastrointestinal.png') },
    { id: '9', nome: 'Dermatológico', imagem: require('../../../public/dermatologia.png') },
    { id: '12', nome: 'Respiratório', imagem: require('../../../public/pulmao.png') },
    { id: '14', nome: 'Antifúngico', imagem: require('../../../public/anti-fungo.png') },
    { id: '15', nome: 'Hormonal', imagem: require('../../../public/hormonios.png') },
  ];
  const produtosPromocaoMock = [
    { med_id: '1', med_nome: 'Paracetamol', medp_preco: 'R$ 15,00', lab_nome: 'Medley', categoria: 'Analgésicos', med_imagem: require('../../../public/paracetamol.png') },
    { med_id: '2', med_nome: 'Dipirona', med_preco: 'R$ 12,50', lab_nome: 'Neo Química', categoria: 'Analgésicos', med_imagem: require('../../../public/dipirona.png') },
  ];
  const marcas = [
    { lab_id: '1', lab_nome: 'Cimed', lab_logo: require('../../../public/cimed.png') },
    { lab_id: '2', lab_nome: 'EuroPharma', lab_logo: require('../../../public/europharma.png') },
  ];

  // --- RENDERIZAÇÃO ---
  const renderCategoria = ({ item }) => {
    if (!item) return null; 
    return (
      <TouchableOpacity
        style={styles.categoriaItem}
        onPress={() => navigation.navigate('Categoria', { 
            nome: item.nome, 
            tipo_id: item.id
        })}
      >
        <Image source={item.imagem} style={styles.categoriaIcon} resizeMode="contain" />
        <Text style={styles.categoriaNome}>{item.nome}</Text>
      </TouchableOpacity>
    );
  };

  const renderProduto = ({ item }) => {
    if (!item) return null; 
    const nome = item?.med_nome || item?.nome;
    const marca = item?.lab_nome || item?.lab_med || item?.marca;
    
    const promo = calcularPrecoPromocional(item);
    
    const imagemOrigem = item?.med_imagem || item?.imagem;
    const imageSource = typeof imagemOrigem === 'string'
      ? { uri: imagemOrigem } 
      : imagemOrigem;

    return (
      <TouchableOpacity
        style={[styles.produtoCard, promo.estaEmPromocao && styles.produtoCardEmPromocao]}
        onPress={() => navigation.navigate('Produto', { produto: item })}
      >
        {promo.estaEmPromocao && (
          <View style={styles.promoBadge}>
            <Text style={styles.promoBadgeTexto}>{promo.descontoPorcento}% OFF</Text>
          </View>
        )}
        <View style={styles.produtoImagem}>
          <Image source={imageSource} style={styles.produtoImagemReal} resizeMode="contain" />
        </View>
        <Text style={styles.produtoNome} numberOfLines={1}>{nome}</Text>
        <Text style={styles.produtoMarca}>{marca}</Text>
        {promo.estaEmPromocao ? (
          <>
            <Text style={styles.produtoPrecoAntigo}>R$ {promo.precoOriginal}</Text>
            <Text style={styles.produtoPreco}>R$ {promo.precoComDesconto}</Text>
          </>
        ) : (
          <Text style={styles.produtoPreco}>R$ {promo.precoOriginal}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderLaboratorio = ({ item }) => {
    if (!item) return null; 
    const imageSource =
      typeof item?.lab_logo_url === 'string' && item?.lab_logo_url.startsWith('http')
        ? { uri: item.lab_logo_url }
        : (item?.lab_logo && (typeof item?.lab_logo === 'string' ? { uri: item.lab_logo_url } : item.lab_logo)) ||
          require('../../../public/cimed.png');

    return (
      <TouchableOpacity
        style={styles.marcaCard}
        onPress={() =>
          navigation.navigate('Laboratorio', {
            lab_id: item?.lab_id,
            nome: item?.lab_nome || item?.nome,
            imagemLaboratorio: item?.lab_logo_url || item?.lab_logo,
          })
        }
      >
        <View style={styles.marcaLogo}>
          <Image source={imageSource} style={styles.marcaLogoImagem} resizeMode="contain" />
        </View>
        <Text style={styles.marcaNome}>{item?.lab_nome || item?.nome}</Text>
      </TouchableOpacity>
    );
  };

  const renderBannerFarmacia = ({ item }) => {
    if (!item) return null; 
    const imageSource = typeof item?.farm_logo_url === 'string'
      ? { uri: item.farm_logo_url }
      : item?.farm_logo_url;

    return (
      <TouchableOpacity
        style={styles.bannerFarmaciaCard}
        onPress={() => navigation.navigate('Farmacia', {
          farm_id: item?.farm_id,
          nome: item?.farm_nome,
          imagemFarmacia: item?.farm_logo_url
        })}
      >
        <Image source={imageSource} style={styles.bannerFarmaciaImagem} resizeMode="stretch" />
        <Text style={styles.bannerFarmaciaNome}>{item?.farm_nome}</Text>
      </TouchableOpacity>
    );
  };

  function handlePesquisar() {
    if (searchText.trim().length > 0) {
      navigation.navigate('Pesquisa', {
        termo: searchText,
      });
      setSearchText(''); 
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../public/LogoEscrita2.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar produto, farmácia ou laboratório..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handlePesquisar}
          returnKeyType="search"
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#006400']}
            tintColor={'#006400'}
          />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <FlatList
            data={categorias}
            renderItem={renderCategoria}
            keyExtractor={item => String(item?.id)} 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriasList}
          />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Destaques</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Categoria', { 
                nome: 'Todos os Medicamentos' 
              })}
            >
              <Text style={styles.verTudo}>Ver Mais</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={produtosDestaque.length > 0 ? produtosDestaque : produtosPromocaoMock}
            renderItem={renderProduto}
            keyExtractor={item => String(item?.med_id)} 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.produtosList}
          />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Farmácias Populares</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Listagem', { 
                tipo: 'farmacia',
                titulo: 'Todas as Farmácias'
              })}
            >
              <Text style={styles.verTudo}>Ver Mais</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={farmaciasPopulares}
            renderItem={renderBannerFarmacia}
            keyExtractor={item => String(item?.farm_id || item?.id || item?.farm_nome)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.marcasList}
          />
        </View>
        
        <View style={styles.section}>
          {/* --- ALTERAÇÃO AQUI: Cabeçalho com botão 'Todas' para Laboratórios --- */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Laboratórios Populares</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Listagem', { 
                tipo: 'laboratorio',
                titulo: 'Todos os Laboratórios'
              })}
            >
              <Text style={styles.verTudo}>Ver Mais</Text>
            </TouchableOpacity>
          </View>
          {/* --------------------------------------------------------------------- */}

          <FlatList
            data={laboratorios.length ? laboratorios : marcas}
            renderItem={renderLaboratorio}
            keyExtractor={item => String(item?.lab_id || item?.id || item?.lab_nome)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.marcasList}
          />
        </View>
        
        <View style={styles.espacoFinal} />
      </ScrollView>
    </View>
  );
}