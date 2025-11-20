import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  RefreshControl // Controle de puxar para atualizar
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import api from '../../services/api';

const DEFAULT_FARMACIA_IMAGE = 'http://192.168.200.27:3334/public/farmacias/padrao.png';

// --- Função Helper de Promoção ---
function calcularPrecoPromocional(item) {
  // Converte para float garantindo que números em string sejam processados
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

  // Validação de Datas
  const hoje = new Date();
  const inicio = new Date(item.promo_inicio);
  const fim = new Date(item.promo_fim);
  hoje.setHours(0, 0, 0, 0); inicio.setHours(0, 0, 0, 0); fim.setHours(0, 0, 0, 0);

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

export default function Farmacia() {
  const route = useRoute();
  const navigation = useNavigation();

  // Proteção contra parâmetros nulos (|| {})
  const { nome, imagemFarmacia, farm_id } = route.params || {};

  // Estados
  const [farmInfo, setFarmInfo] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFavorito, setIsFavorito] = useState(false);

  const favoritosCount = 1250;

  // Configuração do Cabeçalho da Navegação
  useLayoutEffect(() => {
    navigation.setOptions({
      title: nome || 'Farmácia',
      headerBackTitleVisible: false,
    });
  }, [navigation, nome]);

  // Tratamento da URL da imagem
  const imageSource = (typeof imagemFarmacia === 'string' && imagemFarmacia.startsWith('http'))
    ? { uri: imagemFarmacia }
    : { uri: DEFAULT_FARMACIA_IMAGE };

  // --- Lógica de Busca de Dados ---
  const carregarDados = async () => {
    if (!farm_id) return;

    try {
      // 1. Busca detalhes da Farmácia
      const resInfo = await api.get(`/farmacias/${farm_id}`);
      if (resInfo.data.sucesso && resInfo.data.dados) {
        const dados = Array.isArray(resInfo.data.dados) ? resInfo.data.dados[0] : resInfo.data.dados;
        setFarmInfo(dados);
      }

      // 2. Busca medicamentos da farmácia
      const urlMed = `/medicamentos?farmacia_id=${farm_id}`;
      const resMed = await api.get(urlMed);

      const listaRaw = resMed.data.dados || [];
      // Filtra apenas os ativos
      const medicamentosAtivos = listaRaw.filter(item => item.med_ativo === 1);

      setMedicamentos(medicamentosAtivos);

    } catch (error) {
      console.error('Erro ao buscar dados da farmácia:', error);
      setMedicamentos([]);
    }
  };

  // Busca inicial
  useEffect(() => {
    setLoading(true);
    carregarDados().finally(() => setLoading(false));
  }, [farm_id]);

  // Pull-to-Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  }, [farm_id]);

  // Verificação de Favoritos (Local)
  useEffect(() => {
    const verificarFavorito = async () => {
      try {
        const farmaciasFavoritas = await AsyncStorage.getItem('farmaciasFavoritas');
        if (farmaciasFavoritas) {
          const lista = JSON.parse(farmaciasFavoritas);
          setIsFavorito(lista.some(item => item.nome === nome));
        }
      } catch (e) {
        console.log('Erro ao ler favoritos', e);
      }
    };
    verificarFavorito();
  }, [nome]);

  // Ações de Contato
  const handleLigar = () => {
    if (farmInfo?.farm_telefone) Linking.openURL(`tel:${farmInfo.farm_telefone}`);
  };

  const handleEmail = () => {
    if (farmInfo?.farm_email) Linking.openURL(`mailto:${farmInfo.farm_email}`);
  };

  // --- RENDERIZAÇÃO ---

  // 1. Cabeçalho da Lista (Banner + Infos + Contatos)
  // Isso substitui o conteúdo que antes ficava solto no ScrollView
  const renderHeader = () => (
    <View>
      {/* Banner */}
      <View style={styles.bannerGrandeContainer}>
        <Image source={imageSource} style={styles.bannerGrandeImagem} resizeMode="cover" blurRadius={4} />
        <View style={styles.bannerOverlay} />
        <View style={styles.perfilContainer}>
          <View style={styles.perfilImagemWrapper}>
            <Image source={imageSource} style={styles.perfilImagem} resizeMode="contain" backgroundColor="#fff" />
          </View>
          <View style={styles.favoritosContainer}>
            <Ionicons name="heart" size={16} color="#FF6B6B" />
            <Text style={styles.favoritosText}>{favoritosCount.toLocaleString()} favoritos</Text>
          </View>
        </View>
      </View>

      {/* Card de Informações */}
      {farmInfo && (
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#2A7CC7" style={{ marginTop: 2 }} />
            <View style={styles.infoTexts}>
              <Text style={styles.infoLabel}>Endereço</Text>
              <Text style={styles.infoValue}>
                {farmInfo.farm_endereco || 'Endereço não informado'}
                {farmInfo.cidade_nome ? ` - ${farmInfo.cidade_nome}` : ''}
                {farmInfo.uf_sigla ? `/${farmInfo.uf_sigla}` : ''}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactItem} onPress={handleLigar}>
              <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="call" size={18} color="#0284C7" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.contactValue}>
                  {farmInfo.farm_telefone || '---'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
              <View style={[styles.iconCircle, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="mail" size={18} color="#16A34A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>E-mail</Text>
                <Text style={styles.contactValue} numberOfLines={1} ellipsizeMode="tail">
                  {farmInfo.farm_email || '---'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Contador de Itens */}
      <View style={styles.contadorContainer}>
        <Text style={styles.contadorText}>
          {medicamentos.length} medicamento{medicamentos.length !== 1 ? 's' : ''} encontrado{medicamentos.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );

  // 2. Renderização de cada item da lista (Medicamento)
  const renderMedicamento = ({ item }) => {
    const nomeMed = item.med_nome || item.nome;
    const marca = item.lab_nome || item.marca;
    const categoria = item.tipo_nome || item.categoria || 'Medicamento';
    const promo = calcularPrecoPromocional(item);

    const imagemOrigem = item.med_imagem || item.imagem;
    const prodImageSource = (typeof imagemOrigem === 'string' && imagemOrigem.startsWith('http'))
      ? { uri: imagemOrigem }
      : { uri: 'http://192.168.200.27:3334/public/logo.png' };

    return (
      <TouchableOpacity
        style={[styles.medicamentoCard, promo.estaEmPromocao && styles.medicamentoCardEmPromocao]}
        onPress={() => navigation.navigate('Produto', { produto: item })}
      >
        {promo.estaEmPromocao && (
          <View style={styles.promoBadge}>
            <Text style={styles.promoBadgeTexto}>{promo.descontoPorcento}% OFF</Text>
          </View>
        )}

        <View style={styles.medicamentoImagem}>
          <Image source={prodImageSource} style={styles.medicamentoImagemReal} resizeMode="contain" />
        </View>
        <View style={styles.medicamentoInfo}>
          <Text style={styles.medicamentoNome} numberOfLines={2}>{nomeMed}</Text>
          <Text style={styles.medicamentoCategoria}>{marca} • {categoria}</Text>

          {promo.estaEmPromocao ? (
            <View>
              <Text style={styles.medicamentoPrecoAntigo}>R$ {promo.precoOriginal}</Text>
              <Text style={styles.medicamentoPreco}>R$ {promo.precoComDesconto}</Text>
            </View>
          ) : (
            <Text style={styles.medicamentoPreco}>R$ {promo.precoOriginal}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // --- COMPONENTE PRINCIPAL ---

  // Se estiver carregando pela primeira vez (sem ser refresh), mostra loader tela cheia
  if (loading && !refreshing) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#2A7CC7" />
        <Text style={styles.emptyText}>Carregando informações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* CORREÇÃO PERFORMANCE: 
          FlatList agora é o pai. ListHeaderComponent contém o banner.
          Isso ativa a virtualização e impede travamentos com muitos itens.
      */}
      <FlatList
        data={medicamentos}
        renderItem={renderMedicamento}
        keyExtractor={item => String(item.med_id)}

        // Cabeçalho que rola junto com a lista
        ListHeaderComponent={renderHeader}

        // Componente para quando a lista está vazia
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.medicamentoImagemTexto}>💊</Text>
            <Text style={styles.emptyText}>Nenhum medicamento encontrado nesta farmácia</Text>
          </View>
        }

        // Configurações visuais da lista
        contentContainerStyle={styles.medicamentosList}
        showsVerticalScrollIndicator={false}

        // Controle de Atualização
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2A7CC7']}
            tintColor="#2A7CC7"
          />
        }
      />
    </View>
  );
}