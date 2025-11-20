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
  Alert // Importante para feedback de erro
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import api from '../../services/api';

// URL de fallback caso a imagem venha quebrada da API
const DEFAULT_IMAGE_URL = 'http://10.72.152.164:3334/public/medicamentos/caixa-medicamento-padrao5.png';

// --- Função Helper de Promoção ---
// Calcula o preço final e valida se a promoção está ativa hoje
function calcularPrecoPromocional(item) {
  const precoOriginal = parseFloat(item.preco || item.medp_preco);
  const desconto = parseFloat(item.promo_desconto);

  // Validações de segurança
  if (isNaN(precoOriginal) || !desconto || desconto <= 0 || !item.promo_inicio || !item.promo_fim) {
    return {
      precoOriginal: isNaN(precoOriginal) ? ' --,--' : precoOriginal.toFixed(2).replace('.', ','),
      precoComDesconto: null,
      estaEmPromocao: false,
      descontoPorcento: 0
    };
  }

  // Checagem de Datas
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

  // --- EFEITO DE CARREGAMENTO INICIAL ---
  useEffect(() => {
    carregarTodosDados();
  }, []);

  // --- FUNÇÃO DE RECARGA (PULL TO REFRESH) ---
  // Promise.all faz todas as requisições rodarem ao mesmo tempo, sendo mais rápido
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
      // Busca 20 produtos para ter variedade
      const response = await api.get('/medicamentos/todos?limit=20');
      const allDados = response?.data?.dados?.filter(item => item) ?? [];

      // Algoritmo de embaralhamento (Fisher-Yates Shuffle)
      // Isso garante que os destaques mudem a cada recarga
      let shuffled = [...allDados];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Pega apenas os 6 primeiros após embaralhar
      setProdutosDestaque(shuffled.slice(0, 6));
    } catch (error) {
      console.error('Erro ao buscar destaques:', error);
      setProdutosDestaque([]);
    }
  }

  // --- FETCH: FARMÁCIAS ---
  async function fetchFarmaciasPopulares() {
    try {
      const response = await api.get('/farmacias?qtde=4');
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
      // Normaliza o array de dados caso venha em formatos diferentes
      let dados = response?.data?.dados ?? response?.data ?? [];

      // Mapeia para garantir que o campo de URL da imagem seja consistente
      const mapped = Array.isArray(dados) ? dados.map(item => {
        // Tenta encontrar a URL da logo em várias propriedades possíveis
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
  // Usamos require() aqui pois as imagens estão dentro do App
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

  // --- RENDERIZAÇÃO: CATEGORIA ---
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
        {/* resizeMode="contain" evita corte da imagem redonda */}
        <Image source={item.imagem} style={styles.categoriaIcon} resizeMode="contain" />
        <Text style={styles.categoriaNome}>{item.nome}</Text>
      </TouchableOpacity>
    );
  };

  // --- RENDERIZAÇÃO: PRODUTO (CARD) ---
  const renderProduto = ({ item }) => {
    if (!item) return null;

    const nome = item.med_nome || item.nome;
    const marca = item.lab_nome || item.marca || 'Genérico';
    const promo = calcularPrecoPromocional(item);

    // Lógica de Imagem Segura
    const imagemOrigem = item.med_imagem || item.imagem;
    // Se for string (URL), usa uri. Se for número (require), usa direto. Se for nulo, usa fallback.
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

  // --- RENDERIZAÇÃO: LABORATÓRIO ---
  const renderLaboratorio = ({ item }) => {
    if (!item) return null;

    // Lógica local para exibir na Home
    const imageSource = (item.lab_logo_url)
      ? { uri: item.lab_logo_url }
      : require('../../../public/cimed.png'); // Ou sua imagem padrão local

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

  // --- RENDERIZAÇÃO: FARMÁCIA ---
  const renderBannerFarmacia = ({ item }) => {
    if (!item) return null;

    const imageSource = (typeof item.farm_logo_url === 'string' && item.farm_logo_url.length > 5)
      ? { uri: item.farm_logo_url }
      : { uri: DEFAULT_IMAGE_URL }; // Fallback

    return (
      <TouchableOpacity
        style={styles.bannerFarmaciaCard}
        onPress={() => navigation.navigate('Farmacia', {
          farm_id: item.farm_id,
          nome: item.farm_nome,
          imagemFarmacia: item.farm_logo_url
        })}
        activeOpacity={0.8}
      >
        {/* ResizeMode="contain" garante que a logo apareça inteira sem distorcer */}
        <Image source={imageSource} style={styles.bannerFarmaciaImagem} resizeMode="contain" />
        <Text style={styles.bannerFarmaciaNome} numberOfLines={1}>{item.farm_nome}</Text>
      </TouchableOpacity>
    );
  };

  // --- AÇÃO DE PESQUISA (CORRIGIDA) ---
  function handlePesquisar() {
    // CORREÇÃO AQUI: Remove espaços do início e fim para evitar erros com autocomplete
    const termoLimpo = searchText.trim();

    if (termoLimpo.length > 0) {
      navigation.navigate('Pesquisa', { termo: termoLimpo });
      setSearchText(''); // Limpa o campo após pesquisar
    } else {
      Alert.alert('Atenção', 'Digite algo para pesquisar.');
    }
  }

  // --- RENDERIZAÇÃO PRINCIPAL (VIEW) ---
  return (
    <View style={styles.container}>

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <Image
          source={require('../../../public/LogoEscrita2.png')}
          style={styles.logo}
        />
      </View>

      {/* BARRA DE PESQUISA */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍  Pesquisar medicamento, farmácia..."
          placeholderTextColor="#94a3b8"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handlePesquisar} // Pesquisa ao dar Enter no teclado
          returnKeyType="search"
        />
      </View>

      {/* CONTEÚDO ROLÁVEL */}
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
        {/* SEÇÃO: CATEGORIAS */}
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

        {/* SEÇÃO: DESTAQUES */}
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
            // Se não tiver destaques carregados, não mostra nada (evita erro com array mockado antigo)
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

        {/* SEÇÃO: FARMÁCIAS */}
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

        {/* SEÇÃO: LABORATÓRIOS */}
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

        {/* Espaço extra para garantir que o último item não fique escondido pela TabBar */}
        <View style={styles.espacoFinal} />
      </ScrollView>
    </View>
  );
}