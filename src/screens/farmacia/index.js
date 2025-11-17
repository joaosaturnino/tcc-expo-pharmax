import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import api from '../../services/api';

// URL da imagem padrão para farmácias
const DEFAULT_FARMACIA_IMAGE = 'http://192.168.200.27:3334/public/farmacias/padrao.png';

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
// ---------------------------------------------------


export default function Farmacia() {
  const route = useRoute();
  const navigation = useNavigation();

  const { nome, imagemFarmacia, farm_id } = route.params;

  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorito, setIsFavorito] = useState(false);

  const favoritosCount = 1250; // Exemplo estático

  // --- LÓGICA DA IMAGEM (CORREÇÃO) ---
  // Verifica se a imagemFarmacia é uma URL válida da API.
  // Se não for, usa a imagem padrão definida no topo.
  const imageSource = (typeof imagemFarmacia === 'string' && imagemFarmacia.startsWith('http'))
    ? { uri: imagemFarmacia } 
    : { uri: DEFAULT_FARMACIA_IMAGE };
  // -----------------------------------

  // useEffect para buscar os medicamentos
  useEffect(() => {
    async function fetchMedicamentosDaFarmacia() {
      if (!farm_id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const url = `/medicamentos?farmacia_id=${farm_id}`;
        const response = await api.get(url);
        setMedicamentos(response.data.dados || []);
      } catch (error) {
        console.error('Erro ao buscar medicamentos da farmácia:', error);
        setMedicamentos([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMedicamentosDaFarmacia();
  }, [farm_id]);

  // Lógica de Favoritos
  useEffect(() => {
    const verificarFavorito = async () => {
      const farmaciasFavoritas = await AsyncStorage.getItem('farmaciasFavoritas');
      if (farmaciasFavoritas) {
        const lista = JSON.parse(farmaciasFavoritas);
        setIsFavorito(lista.some(item => item.nome === nome));
      }
    };
    verificarFavorito();
  }, [nome]);

  // --- renderMedicamento ---
  const renderMedicamento = ({ item }) => {
    
    const nomeMed = item.med_nome || item.nome;
    const marca = item.lab_nome || item.marca;
    const categoria = item.tipo_nome || item.categoria || 'Medicamento';

    const promo = calcularPrecoPromocional(item);

    const imagemOrigem = item.med_imagem || item.imagem;
    // Tratamento de imagem do produto
    const prodImageSource = (typeof imagemOrigem === 'string' && imagemOrigem.startsWith('http'))
      ? { uri: imagemOrigem } 
      : { uri: 'http://192.168.200.27:3334/public/medicamentos/sem-imagem.png' };

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
          <Image 
            source={prodImageSource} 
            style={styles.medicamentoImagemReal}
            resizeMode="contain"
          />
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

  // Lógica de renderização: Carregando, Vazio ou Lista
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#2A7CC7" />
          <Text style={styles.emptyText}>Buscando medicamentos...</Text>
        </View>
      );
    }
    
    if (medicamentos.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.medicamentoImagemTexto}>💊</Text>
          <Text style={styles.emptyText}>Nenhum medicamento encontrado para esta farmácia</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={medicamentos}
        renderItem={renderMedicamento}
        keyExtractor={item => String(item.med_id)}
        scrollEnabled={false}
        contentContainerStyle={styles.medicamentosList}
      />
    );
  };

  // Renderização principal
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- CORREÇÃO DO BANNER --- */}
        <View style={styles.bannerGrandeContainer}>
          {/* Imagem de Fundo (usando a logo com desfoque) */}
          <Image
            source={imageSource}
            style={styles.bannerGrandeImagem}
            resizeMode="cover"
            blurRadius={4} // Efeito de desfoque
          />
          <View style={styles.bannerOverlay} />
          
          {/* Container do Perfil sobre o Banner */}
          <View style={styles.perfilContainer}>
            <View style={styles.perfilImagemWrapper}>
              {/* Logo da Farmácia no círculo */}
              <Image
                source={imageSource}
                style={styles.perfilImagem}
                resizeMode="contain"
                backgroundColor="#fff"
              />
            </View>
            
            {/* Número de favoritos */}
            <View style={styles.favoritosContainer}>
              <Ionicons name="heart" size={16} color="#FF6B6B" />
              <Text style={styles.favoritosText}>{favoritosCount.toLocaleString()} favoritos</Text>
            </View>
          </View>
        </View>
        {/* -------------------------- */}

        {/* Contador de medicamentos */}
        <View style={styles.contadorContainer}>
          <Text style={styles.contadorText}>
            {medicamentos.length} medicamento{medicamentos.length !== 1 ? 's' : ''} encontrado{medicamentos.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {renderContent()}
        
        <View style={styles.espacoFinal} />
      </ScrollView>
    </View>
  );
}