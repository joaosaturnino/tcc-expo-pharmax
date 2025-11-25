import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  RefreshControl,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import api from '../../services/api';

const DEFAULT_IMAGE_URL = 'http://10.72.152.164:3334/public/medicamentos/caixa-medicamento-padrao5.png';

// --- Função Helper de Promoção ---
function calcularPrecoPromocional(item) {
  const precoOriginal = parseFloat(item.preco || item.medp_preco);
  const desconto = parseFloat(item.promo_desconto);

  if (isNaN(precoOriginal) || !desconto || desconto <= 0 || !item.promo_inicio || !item.promo_fim) {
    return {
      precoOriginal: isNaN(precoOriginal) ? ' --,--' : precoOriginal.toFixed(2).replace('.', ','),
      precoComDesconto: null,
      estaEmPromocao: false,
      descontoPorcento: 0
    };
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
    return {
      precoOriginal: precoOriginal.toFixed(2).replace('.', ','),
      precoComDesconto: precoComDesconto.toFixed(2).replace('.', ','),
      estaEmPromocao: true,
      descontoPorcento: desconto
    };
  }

  return {
    precoOriginal: precoOriginal.toFixed(2).replace('.', ','),
    precoComDesconto: null,
    estaEmPromocao: false,
    descontoPorcento: 0
  };
}

export default function Home() {
  const navigation = useNavigation();

  // --- ESTADOS ---
  const [searchText, setSearchText] = useState('');
  const [farmaciasPopulares, setFarmaciasPopulares] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [produtosDestaque, setProdutosDestaque] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    carregarTodosDados();
  }, []);

  const carregarTodosDados = async () => {
    try {
      await Promise.all([
        fetchDestaques(),
        fetchFarmaciasPopulares(),
        fetchLaboratorios()
      ]);
    } catch (error) {
      console.error("Erro geral ao carregar dados:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await carregarTodosDados();
    setIsRefreshing(false);
  }, []);

  // --- FETCH: PRODUTOS DESTAQUE ---
  async function fetchDestaques() {
    try {
      const response = await api.get('/medicamentos/todos?limit=20');
      const allDados = response?.data?.dados?.filter(item => item) ?? [];
      let shuffled = [...allDados];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setProdutosDestaque(shuffled.slice(0, 6));
    } catch (error) {
      console.error('Erro ao buscar destaques:', error);
      setProdutosDestaque([]);
    }
  }

  // --- FETCH: FARMÁCIAS (ATUALIZADO) ---
  async function fetchFarmaciasPopulares() {
    try {
      const response = await api.get('/farmacias?qtde=4');
      // Agora pegamos os dados diretos, pois o backend já manda 'farm_nota'
      const dados = response?.data?.dados?.filter(item => item) ?? [];
      setFarmaciasPopulares(dados);
    } catch (error) {
      console.error('Erro ao buscar farmácias:', error);
      setFarmaciasPopulares([]);
    }
  }

  // --- FETCH: LABORATÓRIOS ---
  async function fetchLaboratorios() {
    try {
      const response = await api.get('/laboratorios?qtde=6');
      let dados = response?.data?.dados ?? response?.data ?? [];
      const mapped = Array.isArray(dados) ? dados.map(item => {
        const url = item.lab_logo_url || item.logo_url || item.logo || item.imagem_url || null;
        return {
          ...item,
          lab_logo_url: (typeof url === 'string' && url.length > 5) ? url : null,
        };
      }) : [];
      setLaboratorios(mapped);
    } catch (error) {
      console.error('Erro ao buscar laboratórios:', error);
      setLaboratorios([]);
    }
  }

  // --- DADOS ESTÁTICOS (CATEGORIAS) ---
  const categorias = [
    { id: '1', nome: 'Dor', imagem: require('../../../public/dor-de-cabeca.png') },
    { id: '2', nome: 'Antibiótico', imagem: require('../../../public/antibiotico.png') },
    { id: '3', nome: 'Anti-inflam.', imagem: require('../../../public/anti-inflamatorio.png') },
    { id: '4', nome: 'Alergia', imagem: require('../../../public/alergia.png') },
    { id: '5', nome: 'Vitaminas', imagem: require('../../../public/vitaminas.png') },
    { id: '9', nome: 'Pele', imagem: require('../../../public/dermatologia.png') },
    { id: '10', nome: 'Estômago', imagem: require('../../../public/trato-gastrointestinal.png') },
    { id: '11', nome: 'Coração', imagem: require('../../../public/coracao.png') },
  ];

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
    const nome = item.med_nome || item.nome;
    const marca = item.lab_nome || item.marca || 'Genérico';
    const promo = calcularPrecoPromocional(item);
    const imagemOrigem = item.med_imagem || item.imagem;
    const imageSource = (typeof imagemOrigem === 'string' && imagemOrigem.length > 5)
      ? { uri: imagemOrigem }
      : (typeof imagemOrigem === 'number' ? imagemOrigem : { uri: DEFAULT_IMAGE_URL });

    return (
      <TouchableOpacity
        style={[styles.produtoCard, promo.estaEmPromocao && styles.produtoCardEmPromocao]}
        onPress={() => navigation.navigate('Produto', { produto: item })}
        activeOpacity={0.7}
      >
        {promo.estaEmPromocao && (
          <View style={styles.promoBadge}>
            <Text style={styles.promoBadgeTexto}>{promo.descontoPorcento}% OFF</Text>
          </View>
        )}
        <View style={styles.produtoImagem}>
          <Image source={imageSource} style={styles.produtoImagemReal} resizeMode="contain" />
        </View>
        <Text style={styles.produtoNome} numberOfLines={2}>{nome}</Text>
        <Text style={styles.produtoMarca} numberOfLines={1}>{marca}</Text>
        {promo.estaEmPromocao ? (
          <View>
            <Text style={styles.produtoPrecoAntigo}>R$ {promo.precoOriginal}</Text>
            <Text style={styles.produtoPreco}>R$ {promo.precoComDesconto}</Text>
          </View>
        ) : (
          <Text style={styles.produtoPreco}>R$ {promo.precoOriginal}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderLaboratorio = ({ item }) => {
    if (!item) return null;
    const imageSource = (item.lab_logo_url)
      ? { uri: item.lab_logo_url }
      : require('../../../public/cimed.png');

    return (
      <TouchableOpacity
        style={styles.marcaCard}
        onPress={() =>
          navigation.navigate('Laboratorio', {
            lab_id: item.lab_id,
            nome: item.lab_nome || item.nome,
            imagemLaboratorio: item.lab_logo_url
          })
        }
      >
        <View style={styles.marcaLogo}>
          <Image source={imageSource} style={styles.marcaLogoImagem} resizeMode="contain" />
        </View>
        <Text style={styles.marcaNome} numberOfLines={1}>{item.lab_nome || item.nome}</Text>
      </TouchableOpacity>
    );
  };

  // --- RENDERIZAÇÃO: FARMÁCIA (COM NOTA REAL) ---
  const renderBannerFarmacia = ({ item }) => {
    if (!item) return null;

    const imageSource = (typeof item.farm_logo_url === 'string' && item.farm_logo_url.length > 5)
      ? { uri: item.farm_logo_url }
      : { uri: DEFAULT_IMAGE_URL };

    // Usa a nota do backend (farm_nota). Se não tiver, assume 'Novo'
    const notaExibida = item.farm_nota ? item.farm_nota : 'Novo';

    return (
      <TouchableOpacity
        style={styles.bannerFarmaciaCard}
        onPress={() => navigation.navigate('Farmacia', {
          farm_id: item.farm_id,
          nome: item.farm_nome,
          imagemFarmacia: item.farm_logo_url,
          nota: notaExibida
        })}
        activeOpacity={0.8}
      >
        {/* BADGE DA NOTA */}
        <View style={styles.bannerFarmaciaBadge}>
          <Text style={styles.bannerFarmaciaBadgeTexto}>★ {notaExibida}</Text>
        </View>

        <Image source={imageSource} style={styles.bannerFarmaciaImagem} resizeMode="contain" />
        <Text style={styles.bannerFarmaciaNome} numberOfLines={1}>{item.farm_nome}</Text>
      </TouchableOpacity>
    );
  };

  function handlePesquisar() {
    const termoLimpo = searchText.trim();
    if (termoLimpo.length > 0) {
      navigation.navigate('Pesquisa', { termo: termoLimpo });
      setSearchText('');
    } else {
      Alert.alert('Atenção', 'Digite algo para pesquisar.');
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
          placeholder="🔍  Pesquisar medicamento, farmácia..."
          placeholderTextColor="#94a3b8"
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
            colors={['#2A7CC7']}
            tintColor={'#2A7CC7'}
          />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <FlatList
            data={categorias}
            renderItem={renderCategoria}
            keyExtractor={item => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriasList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ofertas em Destaque</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Categoria', {
                nome: 'Todas os Medicamentos'
              })}
            >
              <Text style={styles.verTudo}>Ver mais</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={produtosDestaque}
            renderItem={renderProduto}
            keyExtractor={item => String(item.med_id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.produtosList}
            ListEmptyComponent={
              <Text style={{ color: '#999', fontStyle: 'italic' }}>Carregando ofertas...</Text>
            }
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Farmácias Parceiras</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Listagem', {
                tipo: 'farmacia',
                titulo: 'Todas as Farmácias'
              })}
            >
              <Text style={styles.verTudo}>Ver mais</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={farmaciasPopulares}
            renderItem={renderBannerFarmacia}
            keyExtractor={item => String(item.farm_id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.marcasList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Laboratórios</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Listagem', {
                tipo: 'laboratorio',
                titulo: 'Todos os Laboratórios'
              })}
            >
              <Text style={styles.verTudo}>Ver mais</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={laboratorios}
            renderItem={renderLaboratorio}
            keyExtractor={item => String(item.lab_id)}
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