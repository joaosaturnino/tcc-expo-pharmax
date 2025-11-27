import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Platform,
  Alert,
  RefreshControl // <--- 1. Importado aqui
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './styles';
import api from '../../services/api';

// --- CONFIGURAÇÃO DE IP ---
const SERVER_IP = '172.16.0.34:3334';
const BASE_URL = `http://${SERVER_IP}`;

// Helper para corrigir URL da imagem
const getImageUrl = (caminho) => {
  if (!caminho) return { uri: `${BASE_URL}/public/medicamentos/caixa-medicamento-padrao5.png` };
  if (typeof caminho === 'string' && caminho.startsWith('http')) return { uri: caminho };
  const cleanPath = caminho.startsWith('/') ? caminho.substring(1) : caminho;
  return { uri: `${BASE_URL}/${cleanPath}` };
};

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

export default function Produto() {
  const navigation = useNavigation();
  const route = useRoute();

  const { produto } = route.params || {};

  // --- NORMALIZAÇÃO DOS DADOS ---
  const med_id = produto?.med_id || produto?.medicamento_id || produto?.id;
  const farm_id_origem = produto?.farmacia_id || produto?.farm_id;

  const med_nome = produto?.med_nome || produto?.nome || "Produto";
  const med_marca = produto?.lab_nome || produto?.lab_med || produto?.marca || "Genérico";
  const med_categoria = produto?.nome_tipo || produto?.tipo_nome || produto?.categoria || "Medicamento";
  const med_descricao = produto?.med_descricao || produto?.descricao || "Descrição não informada pelo fabricante.";

  const dosagem = produto?.med_dosagem;
  const qtdeProduto = produto?.med_quantidade;
  const formaProduto = produto?.forma_nome;

  // Estados
  const [farmacias, setFarmacias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // <--- 2. Estado para o refresh
  const [isFavorito, setIsFavorito] = useState(false);
  const [favId, setFavId] = useState(null);
  const [loadingFavorito, setLoadingFavorito] = useState(false);

  // Configura Título do Header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: med_nome,
      headerBackTitleVisible: false,
    });
  }, [navigation, med_nome]);

  // Formatação da Quantidade
  let med_info_display = "";
  if (qtdeProduto) {
    if (typeof qtdeProduto === 'string') med_info_display = qtdeProduto;
    else if (formaProduto) med_info_display = `${qtdeProduto} ${formaProduto}(s)`;
    else med_info_display = `${qtdeProduto} unidades`;
  } else {
    med_info_display = "Conteúdo não especificado";
  }

  const med_imagem_source = getImageUrl(produto?.med_imagem || produto?.imagem);

  // --- 3. REFACTOR: LÓGICA DE BUSCA DE FARMÁCIAS (Extraída para reutilização) ---
  const fetchFarmaciasDoProduto = useCallback(async (isRefresh = false) => {
    if (!med_id) {
      setLoading(false);
      return;
    }
    
    // Se não for um refresh manual, ativa o loading geral da tela
    if (!isRefresh) setLoading(true);
    
    try {
      const response = await api.get(`/medicamentos/${med_id}/farmacias`);
      setFarmacias(response.data.dados ?? []);
    } catch (error) {
      console.error('Erro ao buscar farmácias:', error);
      setFarmacias([]);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }, [med_id]);

  // UseEffect chama a função criada acima
  useEffect(() => {
    fetchFarmaciasDoProduto();
  }, [fetchFarmaciasDoProduto]);

  // --- 4. REFACTOR: LÓGICA DE VERIFICAR FAVORITO (Extraída para reutilização) ---
  const verificarFavorito = useCallback(async () => {
    if (!med_id || !farm_id_origem) return;

    try {
      const userData = await AsyncStorage.getItem('usuario_info');
      if (!userData) return;

      const usuario = JSON.parse(userData);
      const usuario_id = usuario?.usu_id;
      if (!usuario_id) return;

      const response = await api.get(`/favoritos/usuario/${usuario_id}`);
      const listaFavoritosDB = response.data.dados || [];

      const favoritoEncontrado = listaFavoritosDB.find(
        item => item.med_id == med_id && item.farmacia_id == farm_id_origem
      );

      if (favoritoEncontrado) {
        setIsFavorito(true);
        setFavId(favoritoEncontrado.fav_id);
      } else {
        setIsFavorito(false);
        setFavId(null);
      }
    } catch (error) {
      console.log("Erro verificar favorito:", error);
    }
  }, [med_id, farm_id_origem]);

  // UseFocusEffect chama a função criada acima
  useFocusEffect(
    useCallback(() => {
      verificarFavorito();
    }, [verificarFavorito])
  );

  // --- 5. FUNÇÃO ON REFRESH (Puxar para atualizar) ---
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Chama as duas funções ao mesmo tempo e espera terminarem
    await Promise.all([
      fetchFarmaciasDoProduto(true), // Passa true para não piscar a tela inteira
      verificarFavorito()
    ]);
    setRefreshing(false);
  }, [fetchFarmaciasDoProduto, verificarFavorito]);

  // --- TOGGLE FAVORITO ---
  const toggleFavorito = async () => {
    if (!farm_id_origem) {
      Alert.alert("Aviso", "Para favoritar, selecione uma oferta específica de uma farmácia abaixo.");
      return;
    }

    if (loadingFavorito) return;
    setLoadingFavorito(true);

    try {
      const userData = await AsyncStorage.getItem('usuario_info');
      if (!userData) {
        Alert.alert("Login necessário", "Entre na sua conta para salvar favoritos.");
        setLoadingFavorito(false);
        return;
      }
      const usuario = JSON.parse(userData);

      if (isFavorito) {
        await api.delete(`/favoritos/${favId}`, { data: { usuario_id: usuario.usu_id } });
        setIsFavorito(false);
        setFavId(null);
      } else {
        const dadosPost = {
          usuario_id: usuario.usu_id,
          medicamento_id: med_id,
          farmacia_id: farm_id_origem
        };
        const response = await api.post('/favoritos', dadosPost);
        setIsFavorito(true);
        setFavId(response.data.dados.fav_id);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar os favoritos.");
    } finally {
      setLoadingFavorito(false);
    }
  };

  // --- AÇÕES LINK EXTERNO ---
  const fazerChamada = (telefone) => {
    if (!telefone) return;
    const numeroLimpo = telefone.replace(/\D/g, '');
    Linking.openURL(`tel:${numeroLimpo}`);
  };

  const abrirMapa = (coordenadas) => {
    if (!coordenadas) return;
    const url = Platform.select({
      ios: `maps:0,0?q=${coordenadas}`,
      android: `geo:0,0?q=${coordenadas}`
    });
    Linking.openURL(url);
  };

  // --- RENDERIZAÇÃO DE ITEM ---
  const renderCardFarmacia = (item) => {
    const nome = item.farm_nome || 'Farmácia';
    const endereco = item.farm_endereco || 'Endereço indisponível';
    const distancia = item.distancia ? `${item.distancia} km` : '';
    const telefone = item.farm_telefone;
    const coordenadas = item.farm_coordenadas; 

    const promo = calcularPrecoPromocional(item);

    return (
      <View key={item.farm_id || Math.random()} style={[
        styles.farmaciaCard,
        promo.estaEmPromocao && styles.farmaciaCardEmPromocao
      ]}>
        {promo.estaEmPromocao && (
          <View style={styles.promoBadge}>
            <Text style={styles.promoBadgeTexto}>{promo.descontoPorcento}% OFF</Text>
          </View>
        )}
        <Text style={styles.farmaciaNome}>{nome}</Text>
        <Text style={styles.farmaciaEndereco}>{endereco}</Text>
        {distancia ? <Text style={styles.farmaciaDistancia}>Aprox. {distancia}</Text> : null}

        <View style={styles.farmaciaInfo}>
          <View>
            {promo.estaEmPromocao ? (
              <>
                <Text style={styles.farmaciaPrecoAntigo}>R$ {promo.precoOriginal}</Text>
                <Text style={styles.farmaciaPrecoPromocional}>R$ {promo.precoComDesconto}</Text>
              </>
            ) : (
              <Text style={styles.farmaciaPreco}>R$ {promo.precoOriginal}</Text>
            )}
          </View>

          <View style={styles.farmaciaAcoes}>
            {coordenadas && (
              <TouchableOpacity style={styles.farmaciaBotao} onPress={() => abrirMapa(coordenadas)}>
                <MaterialCommunityIcons name="map-marker" size={16} color="#2A7CC7" />
                <Text style={styles.farmaciaBotaoTexto}>Mapa</Text>
              </TouchableOpacity>
            )}
            {telefone && (
              <TouchableOpacity style={styles.farmaciaBotao} onPress={() => fazerChamada(telefone)}>
                <MaterialCommunityIcons name="phone" size={16} color="#2A7CC7" />
                <Text style={styles.farmaciaBotaoTexto}>Ligar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  if (!produto) {
    return (
      <View style={styles.container}><Text style={{ margin: 20 }}>Produto não encontrado.</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        // --- 6. ADICIONADO REFRESH CONTROL AQUI ---
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#2A7CC7']} // Usando a cor primary do seu styles
            tintColor="#2A7CC7" // Para iOS
          />
        }
      >

        {/* CABEÇALHO DO PRODUTO */}
        <View style={styles.produtoHeader}>
          <View style={styles.produtoImagemContainer}>
            <Image
              source={med_imagem_source}
              style={styles.produtoImagem}
              resizeMode="contain"
            />
          </View>
          <View style={styles.produtoInfoBasica}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Text 
                style={[styles.produtoNome, { flex: 1, marginRight: 8 }]} 
                numberOfLines={2}
              >
                {med_nome}
              </Text>

              {farm_id_origem && (
                <TouchableOpacity
                  onPress={toggleFavorito}
                  style={{ padding: 4 }}
                  disabled={loadingFavorito}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {loadingFavorito ? (
                    <ActivityIndicator size="small" color="#999" />
                  ) : (
                    <MaterialCommunityIcons
                      name={isFavorito ? 'heart' : 'heart-outline'}
                      size={28}
                      color={isFavorito ? '#EF4444' : '#94A3B8'}
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.produtoMarcaWrapper}>
              <Text style={styles.produtoMarca}>{med_marca}</Text>
              {dosagem && <Text style={styles.produtoMarca}>{dosagem}</Text>}
            </View>
            <Text style={styles.produtoCategoria}>{med_categoria}</Text>
          </View>
        </View>

        {/* CONTEÚDO */}
        <View style={styles.conteudoContainer}>
          <Text style={styles.secaoTitulo}>Apresentação</Text>
          <Text style={styles.conteudoTexto}>
            {med_info_display}
          </Text>
        </View>

        {/* DESCRIÇÃO */}
        <View style={styles.descricaoContainer}>
          <Text style={styles.secaoTitulo}>Descrição</Text>
          <Text style={styles.descricaoTexto}>{med_descricao}</Text>
        </View>

        {/* LISTA DE FARMÁCIAS */}
        <View style={styles.farmaciasContainer}>
          <Text style={styles.secaoTitulo}>Disponível nas farmácias:</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#2A7CC7" style={{ marginVertical: 20 }} />
          ) : (
            farmacias.length > 0 ? (
              farmacias.map(item => renderCardFarmacia(item))
            ) : (
              <Text style={[styles.descricaoTexto, { fontStyle: 'italic', marginTop: 10 }]}>
                Nenhuma oferta encontrada no momento.
              </Text>
            )
          )}
        </View>

        <View style={styles.espacoFinal} />
      </ScrollView>
    </View>
  );
}