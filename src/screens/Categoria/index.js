import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from './styles';
import api from '../../services/api';

// Fallback de imagem caso venha vazia
const DEFAULT_IMAGE_URL = 'http://10.101.130.164:3334/public/medicamentos/caixa-medicamento-padrao5.png';

// --- FUNÇÃO HELPER (Lógica de Promoção) ---
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

  // Validação de Datas
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

export default function Categoria() {
  const route = useRoute();
  const navigation = useNavigation();

  const { nome, tipo_id } = route.params || {};

  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define o título da tela
  useEffect(() => {
    navigation.setOptions({
      title: nome || 'Medicamentos'
    });
  }, [navigation, nome]);

  // Busca os dados na API
  useEffect(() => {
    async function fetchMedicamentos() {
      setLoading(true);
      try {
        let response;
        if (tipo_id) {
          // Busca por categoria específica
          response = await api.get(`/medicamentos/tipo/${tipo_id}`);
        } else {
          // Busca geral (caso venha de "Ver Tudo")
          response = await api.get('/medicamentos/todos?limit=1000');
        }
        setMedicamentos(response.data.dados || response.data || []);
      } catch (error) {
        console.error('Erro ao buscar medicamentos:', error);
        setMedicamentos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMedicamentos();
  }, [tipo_id]);

  // --- RENDERIZAÇÃO DO CARD ---
  const renderItem = ({ item }) => {
    const nomeMed = item.med_nome || item.nome;
    const marca = item.lab_nome || item.marca || 'Genérico';
    
    // --- NOVO: Nome da Farmácia ---
    const farmacia = item.farm_nome || 'Farmácia Parceira';

    const promo = calcularPrecoPromocional(item);

    // Lógica de Imagem
    const imagemOrigem = item.med_imagem || item.imagem;
    const imageSource = (typeof imagemOrigem === 'string' && imagemOrigem.length > 5)
      ? { uri: imagemOrigem }
      : { uri: DEFAULT_IMAGE_URL };

    return (
      <TouchableOpacity
        style={[styles.medicamentoCard, promo.estaEmPromocao && styles.produtoCardEmPromocao]}
        onPress={() => navigation.navigate('Produto', { produto: item })}
        activeOpacity={0.7}
      >
        {/* Selo de Desconto */}
        {promo.estaEmPromocao && (
          <View style={styles.promoBadge}>
            <Text style={styles.promoBadgeTexto}>{promo.descontoPorcento}% OFF</Text>
          </View>
        )}

        {/* Imagem */}
        <View style={styles.medicamentoImagem}>
          <Image
            source={imageSource}
            style={{ width: '80%', height: '80%' }}
            resizeMode="contain"
          />
        </View>

        {/* Informações */}
        <View style={styles.medicamentoInfo}>
          <View>
            <Text style={styles.medicamentoNome} numberOfLines={2}>{nomeMed}</Text>
            <Text style={styles.medicamentoCategoria} numberOfLines={1}>{marca}</Text>

            {/* --- EXIBIÇÃO DA FARMÁCIA --- */}
            <Text style={styles.medicamentoFarmacia} numberOfLines={1}> {farmacia}</Text>
          </View>

          <View>
            {promo.estaEmPromocao ? (
              <>
                <Text style={styles.produtoPrecoAntigo}>R$ {promo.precoOriginal}</Text>
                <Text style={styles.medicamentoPreco}>R$ {promo.precoComDesconto}</Text>
              </>
            ) : (
              <Text style={styles.medicamentoPreco}>R$ {promo.precoOriginal}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // --- HEADER DA LISTA ---
  const renderHeader = () => (
    <View style={styles.contadorContainer}>
      <Text style={styles.contadorText}>
        {medicamentos.length} medicamento{medicamentos.length !== 1 ? 's' : ''} encontrado{medicamentos.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#2A7CC7" />
        <Text style={styles.emptyText}>Buscando medicamentos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={medicamentos}
        renderItem={renderItem}
        keyExtractor={item => String(item.med_id || item.medp_id || Math.random())}
        numColumns={2}
        ListHeaderComponent={medicamentos.length > 0 ? renderHeader : null}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 40 }}>💊</Text>
            <Text style={styles.emptyText}>Nenhum medicamento encontrado nesta categoria.</Text>
          </View>
        }
        contentContainerStyle={styles.medicamentosList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}