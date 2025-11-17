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
import styles from './styles';
import api from '../../services/api';

// URL da imagem padrão para laboratórios (caso não venha da navegação)
const DEFAULT_LAB_IMAGE = 'http://192.168.200.27:3334/public/laboratorios/padrao.png';

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

export default function Laboratorio() {
  const route = useRoute();
  const navigation = useNavigation();

  // Recebe os dados do Laboratório da rota anterior
  const { nome, imagemLaboratorio, lab_id } = route.params || {};

  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define a imagem: usa a passada pela rota ou a padrão
  const imageSource = (typeof imagemLaboratorio === 'string' && imagemLaboratorio.startsWith('http'))
    ? { uri: imagemLaboratorio }
    : { uri: DEFAULT_LAB_IMAGE };

  // Busca medicamentos filtrando pelo lab_id
  useEffect(() => {
    async function fetchMedicamentosDoLaboratorio() {
      if (!lab_id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Rota para buscar medicamentos de um laboratório específico
        const url = `/medicamentos/todos?lab=${lab_id}&limit=1000`;
        const response = await api.get(url);
        setMedicamentos(response.data.dados || []);
      } catch (error) {
        console.error('Erro ao buscar medicamentos do laboratório:', error);
        setMedicamentos([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMedicamentosDoLaboratorio();
  }, [lab_id]);

  // --- Renderização de cada Item (Igual Farmácia) ---
  const renderMedicamento = ({ item }) => {
    const nomeMed = item.med_nome || item.nome;
    const categoria = item.tipo_nome || item.categoria || 'Medicamento';
    
    const promo = calcularPrecoPromocional(item);

    const imagemOrigem = item.med_imagem || item.imagem;
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
          <Text style={styles.emptyText}>Nenhum medicamento encontrado para este laboratório</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={medicamentos}
        renderItem={renderMedicamento}
        keyExtractor={item => String(item.med_id || item.medp_id)}
        scrollEnabled={false}
        contentContainerStyle={styles.medicamentosList}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER IGUAL AO DA FARMÁCIA --- */}
        <View style={styles.bannerGrandeContainer}>
          {/* Banner Fundo (usando a logo do laboratório ampliada ou imagem específica) */}
          <Image
            source={imageSource}
            style={styles.bannerGrandeImagem}
            resizeMode="cover" 
            blurRadius={2} // Desfoque leve no fundo
          />
          <View style={styles.bannerOverlay} />
          
          {/* Perfil Centralizado */}
          <View style={styles.perfilContainer}>
            <View style={styles.perfilImagemWrapper}>
              <Image
                source={imageSource}
                style={styles.perfilImagem}
                resizeMode="contain"
              />
            </View>
            
            {/* Nome do Laboratório (no lugar onde ficava "Favoritos") */}
            <View style={styles.favoritosContainer}>
               <Text style={[styles.favoritosText, { marginLeft: 0 }]}>{nome}</Text>
            </View>
          </View>
        </View>

        {/* Contador */}
        <View style={styles.contadorContainer}>
          <Text style={styles.contadorText}>
            {medicamentos.length} medicamento{medicamentos.length !== 1 ? 's' : ''} encontrado{medicamentos.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Lista */}
        {renderContent()}
        
        <View style={styles.espacoFinal} />
      </ScrollView>
    </View>
  );
}