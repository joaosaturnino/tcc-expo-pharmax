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
  RefreshControl,
  Modal,
  StatusBar
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './styles';
import api from '../../services/api';

// --- NOVO IMPORT: Contexto para atualizar o badge ---
import { useReserva } from '../../contexts/ReservaContext';

// --- CONFIGURAÇÃO DE IP ---
// Certifique-se de que este IP é o mesmo usado no backend
const SERVER_IP = '10.101.130.164:3334';
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
      precoOriginal: isNaN(precoOriginal) ? 0 : precoOriginal,
      precoOriginalFmt: isNaN(precoOriginal) ? ' --,--' : precoOriginal.toFixed(2).replace('.', ','),
      precoComDesconto: null,
      estaEmPromocao: false,
      descontoPorcento: 0,
      precoFinal: isNaN(precoOriginal) ? 0 : precoOriginal
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
      precoOriginal: precoOriginal,
      precoOriginalFmt: precoOriginal.toFixed(2).replace('.', ','),
      precoComDesconto: precoComDesconto.toFixed(2).replace('.', ','),
      estaEmPromocao: true,
      descontoPorcento: desconto,
      precoFinal: precoComDesconto
    };
  }

  return {
    precoOriginal: precoOriginal,
    precoOriginalFmt: precoOriginal.toFixed(2).replace('.', ','),
    precoComDesconto: null,
    estaEmPromocao: false,
    descontoPorcento: 0,
    precoFinal: precoOriginal
  };
}

export default function Produto() {
  const navigation = useNavigation();
  const route = useRoute();
  const { produto } = route.params || {};

  // --- USO DO CONTEXTO ---
  // Pegamos a função que força a atualização do badge na TabBar
  const { atualizarBadge } = useReserva();

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

  const [farmacias, setFarmacias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFavorito, setIsFavorito] = useState(false);
  const [favId, setFavId] = useState(null);
  const [loadingFavorito, setLoadingFavorito] = useState(false);

  // Estados para Reserva
  const [modalVisible, setModalVisible] = useState(false);
  const [farmaciaSelecionada, setFarmaciaSelecionada] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [loadingReserva, setLoadingReserva] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: med_nome,
      headerBackTitleVisible: false,
    });
  }, [navigation, med_nome]);

  let med_info_display = "";
  if (qtdeProduto) {
    if (typeof qtdeProduto === 'string') med_info_display = qtdeProduto;
    else if (formaProduto) med_info_display = `${qtdeProduto} ${formaProduto}(s)`;
    else med_info_display = `${qtdeProduto} unidades`;
  } else {
    med_info_display = "Conteúdo não especificado";
  }

  const med_imagem_source = getImageUrl(produto?.med_imagem || produto?.imagem);

  // --- LÓGICA DO MODAL ---
  const promoSelecionada = farmaciaSelecionada ? calcularPrecoPromocional(farmaciaSelecionada) : { precoFinal: 0 };
  const totalEstimado = (promoSelecionada.precoFinal * quantidade).toFixed(2).replace('.', ',');

  const fetchFarmaciasDoProduto = useCallback(async (isRefresh = false) => {
    if (!med_id) { setLoading(false); return; }
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

  useEffect(() => { fetchFarmaciasDoProduto(); }, [fetchFarmaciasDoProduto]);

  const verificarFavorito = useCallback(async () => {
    if (!med_id || !farm_id_origem) return;
    try {
      const userData = await AsyncStorage.getItem('usuario_info');
      if (!userData) return;
      const usuario = JSON.parse(userData);
      const response = await api.get(`/favoritos/usuario/${usuario.usu_id}`);
      const lista = response.data.dados || [];
      const item = lista.find(i => i.med_id == med_id && i.farmacia_id == farm_id_origem);
      if (item) { setIsFavorito(true); setFavId(item.fav_id); }
      else { setIsFavorito(false); setFavId(null); }
    } catch (error) { console.log("Erro favorito:", error); }
  }, [med_id, farm_id_origem]);

  useFocusEffect(useCallback(() => { verificarFavorito(); }, [verificarFavorito]));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchFarmaciasDoProduto(true), verificarFavorito()]);
    setRefreshing(false);
  }, [fetchFarmaciasDoProduto, verificarFavorito]);

  const toggleFavorito = async () => {
    if (!farm_id_origem) { Alert.alert("Aviso", "Selecione uma oferta específica."); return; }
    if (loadingFavorito) return;
    setLoadingFavorito(true);
    try {
      const userData = await AsyncStorage.getItem('usuario_info');
      if (!userData) { Alert.alert("Login necessário", "Entre na conta."); setLoadingFavorito(false); return; }
      const usuario = JSON.parse(userData);
      if (isFavorito) {
        await api.delete(`/favoritos/${favId}`, { data: { usuario_id: usuario.usu_id } });
        setIsFavorito(false); setFavId(null);
      } else {
        const res = await api.post('/favoritos', { usuario_id: usuario.usu_id, medicamento_id: med_id, farmacia_id: farm_id_origem });
        setIsFavorito(true); setFavId(res.data.dados.fav_id);
      }
    } catch (error) { Alert.alert("Erro", "Falha ao atualizar favoritos."); }
    finally { setLoadingFavorito(false); }
  };

  const abrirModalReserva = (farmacia) => {
    setFarmaciaSelecionada(farmacia);
    setQuantidade(1);
    setModalVisible(true);
  };

  const aumentarQtd = () => setQuantidade(q => q + 1);
  const diminuirQtd = () => setQuantidade(q => (q > 1 ? q - 1 : 1));

  // --- FUNÇÃO DE CONFIRMAR RESERVA ATUALIZADA ---
  const confirmarReserva = async () => {
    setLoadingReserva(true);
    try {
      const userData = await AsyncStorage.getItem('usuario_info');
      if (!userData) {
        setModalVisible(false);
        Alert.alert("Login Necessário", "Faça login para reservar.", [{ text: "Entrar", onPress: () => navigation.navigate('Login') }, { text: "Cancelar" }]);
        setLoadingReserva(false); return;
      }
      const usuario = JSON.parse(userData);
      const payload = {
        usuario_id: usuario.usu_id || usuario.id,
        medicamento_id: med_id,
        farmacia_id: farmaciaSelecionada.farm_id,
        quantidade: quantidade,
        valor_unitario: promoSelecionada.precoFinal
      };

      const response = await api.post('/reservas', payload);
      
      if (response.data.sucesso) {
        // --- ATUALIZAÇÃO DO BADGE ---
        // Aqui chamamos o contexto para avisar a TabBar que temos uma nova reserva
        await atualizarBadge(usuario.usu_id || usuario.id);
        
        setModalVisible(false);
        Alert.alert("Reserva Realizada! 🎉", "Acompanhe em 'Meus Pedidos'.", [{ text: "Ir para Pedidos", onPress: () => navigation.navigate('MeusPedidos') }, { text: "OK" }]);
      } else {
        Alert.alert("Atenção", response.data.mensagem || "Erro ao reservar.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha de conexão.");
    } finally { setLoadingReserva(false); }
  };

  const fazerChamada = (tel) => { if (tel) Linking.openURL(`tel:${tel.replace(/\D/g, '')}`); };
  const abrirMapa = (coord) => {
    if (!coord) return;
    const url = Platform.select({ ios: `maps:0,0?q=${coord}`, android: `geo:0,0?q=${coord}` });
    Linking.openURL(url);
  };

  const renderCardFarmacia = (item) => {
    const promo = calcularPrecoPromocional(item);
    return (
      <View key={item.farm_id || Math.random()} style={[styles.farmaciaCard, promo.estaEmPromocao && styles.farmaciaCardEmPromocao]}>
        {promo.estaEmPromocao && <View style={styles.promoBadge}><Text style={styles.promoBadgeTexto}>{promo.descontoPorcento}% OFF</Text></View>}
        <Text style={styles.farmaciaNome}>{item.farm_nome || 'Farmácia'}</Text>
        <Text style={styles.farmaciaEndereco}>{item.farm_endereco || 'Endereço indisponível'}</Text>
        {item.distancia ? <Text style={styles.farmaciaDistancia}>Aprox. {item.distancia} km</Text> : null}

        <View style={styles.farmaciaInfo}>
          <View>
            {promo.estaEmPromocao ? (
              <>
                <Text style={styles.farmaciaPrecoAntigo}>R$ {promo.precoOriginalFmt}</Text>
                <Text style={styles.farmaciaPrecoPromocional}>R$ {promo.precoComDesconto}</Text>
              </>
            ) : (
              <Text style={styles.farmaciaPreco}>R$ {promo.precoOriginalFmt}</Text>
            )}
          </View>
          <View style={styles.farmaciaAcoes}>
            <TouchableOpacity style={styles.botaoReservar} onPress={() => abrirModalReserva(item)}>
              <MaterialCommunityIcons name="cart-plus" size={18} color="#FFF" />
              <Text style={styles.botaoReservarTexto}>Reservar</Text>
            </TouchableOpacity>
            {item.farm_coordenadas && (
              <TouchableOpacity style={styles.farmaciaBotao} onPress={() => abrirMapa(item.farm_coordenadas)}>
                <MaterialCommunityIcons name="map-marker" size={20} color="#2A7CC7" />
              </TouchableOpacity>
            )}
            {item.farm_telefone && (
              <TouchableOpacity style={styles.farmaciaBotao} onPress={() => fazerChamada(item.farm_telefone)}>
                <MaterialCommunityIcons name="phone" size={20} color="#2A7CC7" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (!produto) return <View style={styles.container}><Text style={{ margin: 20 }}>Produto não encontrado.</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2A7CC7']} tintColor="#2A7CC7" />}
      >
        <View style={styles.produtoHeader}>
          <View style={styles.produtoImagemContainer}>
            <Image source={med_imagem_source} style={styles.produtoImagem} resizeMode="contain" />
          </View>
          <View style={styles.produtoInfoBasica}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[styles.produtoNome, { flex: 1, marginRight: 8 }]} numberOfLines={2}>{med_nome}</Text>
              {farm_id_origem && (
                <TouchableOpacity onPress={toggleFavorito} disabled={loadingFavorito} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  {loadingFavorito ? <ActivityIndicator size="small" color="#999" /> :
                    <MaterialCommunityIcons name={isFavorito ? 'heart' : 'heart-outline'} size={28} color={isFavorito ? '#EF4444' : '#94A3B8'} />}
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

        <View style={styles.conteudoContainer}>
          <Text style={styles.secaoTitulo}>Apresentação</Text>
          <Text style={styles.conteudoTexto}>{med_info_display}</Text>
        </View>

        <View style={styles.descricaoContainer}>
          <Text style={styles.secaoTitulo}>Descrição</Text>
          <Text style={styles.descricaoTexto}>{med_descricao}</Text>
        </View>

        <View style={styles.farmaciasContainer}>
          <Text style={styles.secaoTitulo}>Disponível nas farmácias:</Text>
          {loading ? <ActivityIndicator size="large" color="#2A7CC7" style={{ marginVertical: 20 }} /> :
            (farmacias.length > 0 ? farmacias.map(item => renderCardFarmacia(item)) :
              <Text style={[styles.descricaoTexto, { fontStyle: 'italic', marginTop: 10 }]}>Nenhuma oferta encontrada.</Text>)
          }
        </View>
        <View style={styles.espacoFinal} />
      </ScrollView>

      {/* --- MODAL DE RESERVA --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Confirmar Reserva</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitulo}>
              Você está reservando <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>{med_nome}</Text> na farmácia {farmaciaSelecionada?.farm_nome}.
            </Text>

            <View style={styles.qtdContainer}>
              <TouchableOpacity style={styles.qtdBotao} onPress={diminuirQtd}>
                <MaterialCommunityIcons name="minus" size={20} color="#333" />
              </TouchableOpacity>
              <Text style={styles.qtdTexto}>{quantidade}</Text>
              <TouchableOpacity style={styles.qtdBotao} onPress={aumentarQtd}>
                <MaterialCommunityIcons name="plus" size={20} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.resumoContainer}>
              <View style={styles.resumoLinha}>
                <Text style={styles.resumoLabel}>Preço Unitário:</Text>
                <Text style={styles.resumoValor}>R$ {promoSelecionada?.precoFinal?.toFixed(2).replace('.', ',')}</Text>
              </View>
              <View style={[styles.resumoLinha, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#BBF7D0' }]}>
                <Text style={styles.resumoTotalLabel}>TOTAL ESTIMADO:</Text>
                <Text style={styles.resumoTotalValor}>R$ {totalEstimado}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.btnConfirmarReserva} onPress={confirmarReserva} disabled={loadingReserva}>
              {loadingReserva ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnConfirmarTexto}>Confirmar Reserva</Text>}
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}