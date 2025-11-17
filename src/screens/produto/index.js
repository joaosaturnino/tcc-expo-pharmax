import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  Linking, 
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import api from '../../services/api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// --- VERIFIQUE ESTA URL ---
// Esta é a URL da sua imagem padrão? (baseado nos seus logs era 'sem-imagem.png',
// mas se for 'alergia.png', troque o nome do arquivo aqui)
const DEFAULT_IMAGE_URL = 'http://192.168.200.27:3334/public/medicamentos/caixa-medicamento-padrao5.png';
// -------------------------

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
// ---------------------------------------------

export default function Produto() {
  const navigation = useNavigation();
  const route = useRoute();
  const { produto } = route.params || {};

  // Estados
  const [farmacias, setFarmacias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorito, setIsFavorito] = useState(false);
  const [favId, setFavId] = useState(null); 
  const [loadingFavorito, setLoadingFavorito] = useState(true);

  // Normalização
  const med_id = produto?.med_id || produto?.medicamento_id || produto?.id;
  const farm_id = produto?.farmacia_id || produto?.farm_id; 
  const med_nome = produto?.med_nome || produto?.nome || "Nome Indisponível";
  const med_marca = produto?.lab_nome || produto?.lab_med || produto?.marca || "Marca Desconhecida";
  const med_categoria = produto?.nome_tipo || produto?.tipo_nome || produto?.categoria || "Sem categoria"; 
  const med_descricao = produto?.med_descricao || produto?.descricao || "Descrição não disponível.";
  
  const dosagem = produto?.med_dosagem;
  const qtdeProduto = produto?.med_quantidade;
  const formaProduto = produto?.forma_nome; 

  let med_info_display = "";
  if (qtdeProduto) {
      if (typeof qtdeProduto === 'string') {
          med_info_display = qtdeProduto;
      } 
      else if (formaProduto) {
          med_info_display = `${qtdeProduto} ${formaProduto}(s)`;
      } else {
          med_info_display = `${qtdeProduto} unidades`;
      }
  } else {
      med_info_display = "Informação não disponível";
  }
  
  // Lógica da Imagem (Correta)
  const imagemOrigem = produto?.med_imagem || produto?.imagem;
  const med_imagem_source = (typeof imagemOrigem === 'string' && imagemOrigem.startsWith('http'))
    ? { uri: imagemOrigem }
    : { uri: DEFAULT_IMAGE_URL };
    
  // useEffect fetchFarmaciasDoProduto
  useEffect(() => {
    async function fetchFarmaciasDoProduto() {
      if (!med_id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await api.get(`/medicamentos/${med_id}/farmacias`);
        setFarmacias(response.data.dados ?? []);
      } catch (error) {
        console.error('Erro ao buscar farmácias para o produto:', error);
        setFarmacias([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFarmaciasDoProduto();
  }, [med_id]);

  
  // useFocusEffect
  useFocusEffect(
    useCallback(() => {
      const verificarFavorito = async () => {
        if (!med_id || !farm_id) {
            setLoadingFavorito(false); 
            return;
        }
        setLoadingFavorito(true);
        try {
          const userData = await AsyncStorage.getItem('usuario_info');
          if (!userData) {
            setIsFavorito(false);
            setFavId(null);
            setLoadingFavorito(false);
            return;
          }
          const usuario = JSON.parse(userData);
          const usuario_id = usuario?.usu_id;
          
          if (!usuario_id) {
            setIsFavorito(false);
            setFavId(null);
            setLoadingFavorito(false); 
            return;
          }
          const response = await api.get(`/favoritos/usuario/${usuario_id}`);
          const listaFavoritosDB = response.data.dados || [];

          const favoritoEsteProduto = listaFavoritosDB.find(
            item => item.med_id == med_id && item.farmacia_id == farm_id
          );

          if (favoritoEsteProduto) {
            setIsFavorito(true);
            setFavId(favoritoEsteProduto.fav_id);
          } else {
            setIsFavorito(false);
            setFavId(null);
          }
        } catch (error) {
          console.error("Erro ao verificar favoritos:", error);
          setIsFavorito(false);
          setFavId(null);
        } finally {
          setLoadingFavorito(false);
        }
      };
      
      verificarFavorito();
    }, [med_id, farm_id])
  );

  // toggleFavorito
  const toggleFavorito = async () => {
    if (loadingFavorito) return;
    setLoadingFavorito(true);
    try {
      const userData = await AsyncStorage.getItem('usuario_info');
      const usuario = JSON.parse(userData);
      const usuario_id = usuario?.usu_id;
      if (!usuario_id) {
        alert('Você precisa estar logado para favoritar.');
        setLoadingFavorito(false);
        return;
      }
      if (isFavorito) {
        await api.delete(`/favoritos/${favId}`, { data: { usuario_id: usuario_id } });
        setIsFavorito(false);
        setFavId(null);
      } else {
        const dadosPost = {
          usuario_id: usuario_id,
          medicamento_id: med_id,
          farmacia_id: farm_id
        };
        const response = await api.post('/favoritos', dadosPost);
        const novoFavId = response.data.dados.fav_id; 
        setIsFavorito(true);
        setFavId(novoFavId);
      }
    } catch (error) {
      console.error("Erro ao salvar favorito:", error.response ? error.response.data : error);
      if(error.response && error.response.data && error.response.data.mensagem) {
        alert(`Erro: ${error.response.data.mensagem}`);
      }
    } finally {
      setLoadingFavorito(false);
    }
  };


  // Ações
  const fazerChamada = (telefone) => {/* ... */};
  const abrirMapa = (coordenadas) => {/* ... */};

  // --- renderFarmacia ---
  const renderFarmacia = ({ item }) => {
    const nome = item.farm_nome || 'Farmácia';
    const endereco = item.farm_endereco || 'Endereço não informado';
    const distancia = item.distancia || 'N/A';
    const quantidade = item.quantidade || 0;
    const telefone = item.farm_telefone;
    const coordenadas = item.farm_coordenadas;

    const promo = calcularPrecoPromocional(item);

    return (
      <View style={[
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
        <Text style={styles.farmaciaDistancia}>{distancia}</Text>
        
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
            <Text style={styles.farmaciaQuantidade}>Disponível: {quantidade} unidades</Text>
          </View>
          
          <View style={styles.farmaciaAcoes}>
            {coordenadas && (
              <TouchableOpacity style={styles.farmaciaBotao} onPress={() => abrirMapa(coordenadas)}>
                <Text style={styles.farmaciaBotaoTexto}>🗺️ Como chegar</Text>
              </TouchableOpacity>
            )}
            {telefone && (
              <TouchableOpacity style={styles.farmaciaBotao} onPress={() => fazerChamada(telefone)}>
                <Text style={styles.farmaciaBotaoTexto}>📞 Ligar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  // --- RENDERIZAÇÃO PRINCIPAL ---
  if (!produto) {
    return (
      <View style={styles.container}><Text>Produto não encontrado</Text></View>
    );
  }

  return (
    <View style={styles.container}> 
      <ScrollView style={styles.content}>
        {/* Bloco: Imagem e Informações Básicas */}
        <View style={styles.produtoHeader}>
          <View style={styles.produtoImagemContainer}>
            <Image 
              source={med_imagem_source}
              style={styles.produtoImagem}
              resizeMode="contain"
            />
          </View>
          <View style={styles.produtoInfoBasica}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.produtoNome}>{med_nome}</Text>
              
              {/* --- ÍCONE DE CORAÇÃO --- */}
              <TouchableOpacity 
                onPress={toggleFavorito} 
                style={{ marginLeft: 12, padding: 5 }}
                disabled={loadingFavorito}
              >
                {loadingFavorito ? (
                  <ActivityIndicator size="small" color="#999" />
                ) : (
                  <MaterialCommunityIcons 
                    name={isFavorito ? 'heart' : 'heart-outline'}
                    size={28}
                    color={isFavorito ? '#e74c3c' : '#999'}
                  />
                )}
              </TouchableOpacity>
              
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Text style={styles.produtoMarca}>{med_marca}</Text>
                {dosagem && (
                    <Text style={[styles.produtoMarca, { marginLeft: 5 }]}>• {dosagem}</Text>
                )}
            </View>
            <Text style={styles.produtoCategoria}>{med_categoria}</Text>
          </View>
        </View>

        {/* Bloco de Conteúdo */}
        <View style={styles.conteudoContainer}>
          <Text style={styles.secaoTitulo}>Conteúdo</Text>
          <Text style={styles.conteudoTexto}>
            {med_info_display}
          </Text>
        </View>

        {/* Bloco: Descrição */}
        <View style={styles.descricaoContainer}>
          <Text style={styles.secaoTitulo}>Descrição</Text>
          <Text style={styles.descricaoTexto}>{med_descricao}</Text>
        </View>

        {/* Bloco: Lista de Farmácias */}
        <View style={styles.farmaciasContainer}>
          <Text style={styles.secaoTitulo}>Disponível nas farmácias:</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#2A7CC7" style={{ marginVertical: 20 }} />
          ) : (
            farmacias.length > 0 ? (
              <FlatList
                data={farmacias}
                renderItem={renderFarmacia}
                keyExtractor={item => String(item.farm_id)}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.descricaoTexto}>Nenhuma farmácia encontrada com este produto.</Text>
            )
          )}
        </View>
        
        <View style={styles.espacoFinal} />
      </ScrollView>
    </View>
  );
}