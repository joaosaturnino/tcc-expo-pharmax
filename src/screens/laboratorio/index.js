import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  RefreshControl
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import api from '../../services/api';

// Imagem padrão caso o laboratório não tenha logo ou a URL quebre
const DEFAULT_LAB_IMAGE = '../../../public/logo.png';

// --- FUNÇÃO HELPER: Lógica de Promoção ---
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

  // Verificação de datas
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

export default function Laboratorio() {
  const route = useRoute();
  const navigation = useNavigation();

  // Recupera parametros da rota (|| {} evita crash se vier vazio)
  const { nome, imagemLaboratorio, lab_id } = route.params || {};

  // Estados
  const [labInfo, setLabInfo] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- EFEITO DE TÍTULO ---
  // Atualiza o título da navegação assim que temos os dados do laboratório
  useLayoutEffect(() => {
    navigation.setOptions({
      title: labInfo?.lab_nome || nome || 'Laboratório',
      headerBackTitleVisible: false,
    });
  }, [navigation, nome, labInfo]);

  // Tratamento da Imagem do Topo
  const imageSource = (typeof imagemLaboratorio === 'string' && imagemLaboratorio.startsWith('http'))
    ? { uri: imagemLaboratorio }
    : { uri: DEFAULT_LAB_IMAGE };

  // --- BUSCA DE DADOS ---
  const carregarDados = async () => {
    if (!lab_id) return;

    try {
      // 1. Busca detalhes do Laboratório
      const resLab = await api.get(`/laboratorios/${lab_id}`);
      if (resLab.data.sucesso && resLab.data.dados) {
        // Garante que pegamos o objeto correto (se vier array ou objeto direto)
        const dadosLab = Array.isArray(resLab.data.dados) ? resLab.data.dados[0] : resLab.data.dados;
        setLabInfo(dadosLab);
      }

      // 2. Busca medicamentos vinculados a este laboratório
      const urlMed = `/medicamentos/todos?lab=${lab_id}&limit=1000`;
      const resMed = await api.get(urlMed);

      // Verifica se os dados existem antes de setar
      setMedicamentos(resMed.data.dados || []);

    } catch (error) {
      console.error('Erro ao buscar dados do laboratório:', error);
      // Não limpamos medicamentos aqui para não piscar a tela em caso de erro de rede momentâneo
    }
  };

  // Busca Inicial
  useEffect(() => {
    setLoading(true);
    carregarDados().finally(() => setLoading(false));
  }, [lab_id]);

  // Puxar para Atualizar
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  }, [lab_id]);

  // --- AÇÕES DE CONTATO ---
  const handleLigar = () => {
    if (labInfo?.lab_telefone) Linking.openURL(`tel:${labInfo.lab_telefone}`);
  };

  const handleEmail = () => {
    if (labInfo?.lab_email) Linking.openURL(`mailto:${labInfo.lab_email}`);
  };

  // --- RENDERIZAÇÃO: CABEÇALHO ---
  // Este componente substitui o conteúdo que antes ficava solto na ScrollView.
  // Ele rola junto com a lista de medicamentos.
  const renderHeader = () => (
    <View>
      {/* Banner e Foto de Perfil */}
      <View style={styles.bannerGrandeContainer}>
        <Image source={imageSource} style={styles.bannerGrandeImagem} resizeMode="cover" blurRadius={2} />
        <View style={styles.bannerOverlay} />
        <View style={styles.perfilContainer}>
          <View style={styles.perfilImagemWrapper}>
            <Image source={imageSource} style={styles.perfilImagem} resizeMode="contain" backgroundColor="#fff" />
          </View>
          <View style={styles.favoritosContainer}>
            <Text style={[styles.favoritosText, { marginLeft: 0 }]}>
              {labInfo?.lab_nome || nome}
            </Text>
          </View>
        </View>
      </View>

      {/* Card de Informações (Endereço, Contato) */}
      {labInfo && (
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#2A7CC7" style={{ marginTop: 2 }} />
            <View style={styles.infoTexts}>
              <Text style={styles.infoLabel}>Endereço</Text>
              <Text style={styles.infoValue}>
                {labInfo.lab_endereco || 'Endereço não informado'}
                {labInfo.cidade_nome ? ` - ${labInfo.cidade_nome}` : ''}
                {labInfo.uf_sigla ? `/${labInfo.uf_sigla}` : ''}
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
                  {labInfo.lab_telefone || '---'}
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
                  {labInfo.lab_email || '---'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Contador de Produtos */}
      <View style={styles.contadorContainer}>
        <Text style={styles.contadorText}>
          {medicamentos.length} produto{medicamentos.length !== 1 ? 's' : ''} listado{medicamentos.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );

  // --- RENDERIZAÇÃO: ITEM DA LISTA (MEDICAMENTO) ---
  const renderMedicamento = ({ item }) => {
    const nomeMed = item.med_nome || item.nome;
    const categoria = item.tipo_nome || item.categoria || 'Medicamento';
    const promo = calcularPrecoPromocional(item);

    // Tratamento de imagem do produto
    const imagemOrigem = item.med_imagem || item.imagem;
    const prodImageSource = (typeof imagemOrigem === 'string' && imagemOrigem.startsWith('http'))
      ? { uri: imagemOrigem }
      : { uri: 'http://172.16.0.32:3334/public/medicamentos/sem-imagem.png' };

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
          <Text style={styles.medicamentoCategoria}>{categoria}</Text>
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

  // --- RENDERIZAÇÃO PRINCIPAL ---

  // Loading inicial (tela cheia)
  if (loading && !refreshing) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#2A7CC7" />
        <Text style={styles.emptyText}>Carregando informações do laboratório...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* CORREÇÃO DE PERFORMANCE:
          FlatList agora é o elemento raiz. 
          O cabeçalho (banner, infos) entra em ListHeaderComponent.
          Isso ativa a virtualização e evita travamentos com muitos itens.
      */}
      <FlatList
        data={medicamentos}
        renderItem={renderMedicamento}
        keyExtractor={item => String(item.med_id || item.medp_id || Math.random())}

        // Cabeçalho que rola junto
        ListHeaderComponent={renderHeader}

        // Estado vazio (se carregou e não tem remédios)
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.medicamentoImagemTexto}>💊</Text>
            <Text style={styles.emptyText}>Nenhum medicamento encontrado para este laboratório.</Text>
          </View>
        }

        // Configurações visuais
        contentContainerStyle={styles.medicamentosList}
        showsVerticalScrollIndicator={false}

        // Pull to Refresh
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