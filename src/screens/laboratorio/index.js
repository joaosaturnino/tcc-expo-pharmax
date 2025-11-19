import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  ActivityIndicator,
  Linking // Importado para abrir o discador ou email
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Certifique-se de ter instalado
import styles from './styles';
import api from '../../services/api';

const DEFAULT_LAB_IMAGE = 'http://192.168.200.27:3334/public/laboratorios/padrao.png';

// --- Função Helper de Promoção (Mantida igual) ---
function calcularPrecoPromocional(item) {
  const precoOriginal = parseFloat(item.preco || item.medp_preco);
  const desconto = parseFloat(item.promo_desconto);
  
  if (isNaN(precoOriginal) || !desconto || desconto <= 0 || !item.promo_inicio || !item.promo_fim) {
    return { precoOriginal: isNaN(precoOriginal) ? ' --,--' : precoOriginal.toFixed(2).replace('.', ','), precoComDesconto: null, estaEmPromocao: false, descontoPorcento: 0 };
  }

  const hoje = new Date();
  const inicio = new Date(item.promo_inicio);
  const fim = new Date(item.promo_fim);
  hoje.setHours(0, 0, 0, 0); inicio.setHours(0, 0, 0, 0); fim.setHours(0, 0, 0, 0);

  const estaEmPromocao = (hoje >= inicio && hoje <= fim);

  if (estaEmPromocao) {
    const precoComDesconto = precoOriginal * (1 - desconto / 100);
    return { precoOriginal: precoOriginal.toFixed(2).replace('.', ','), precoComDesconto: precoComDesconto.toFixed(2).replace('.', ','), estaEmPromocao: true, descontoPorcento: desconto };
  }
  return { precoOriginal: precoOriginal.toFixed(2).replace('.', ','), precoComDesconto: null, estaEmPromocao: false, descontoPorcento: 0 };
}

export default function Laboratorio() {
  const route = useRoute();
  const navigation = useNavigation();

  const { nome, imagemLaboratorio, lab_id } = route.params || {};

  // Estado para guardar os detalhes do laboratório (Endereço, email, etc)
  const [labInfo, setLabInfo] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: nome || 'Laboratório',
      headerBackTitleVisible: false, 
    });
  }, [navigation, nome]);

  const imageSource = (typeof imagemLaboratorio === 'string' && imagemLaboratorio.startsWith('http'))
    ? { uri: imagemLaboratorio }
    : { uri: DEFAULT_LAB_IMAGE };

  // --- Busca Dados Completos (Info + Medicamentos) ---
  useEffect(() => {
    async function fetchData() {
      if (!lab_id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // 1. Busca detalhes do Laboratório (Endereço, Email, etc)
        const resLab = await api.get(`/laboratorios/${lab_id}`);
        if(resLab.data.sucesso && resLab.data.dados) {
            setLabInfo(resLab.data.dados);
        }

        // 2. Busca medicamentos
        const urlMed = `/medicamentos/todos?lab=${lab_id}&limit=1000`;
        const resMed = await api.get(urlMed);
        setMedicamentos(resMed.data.dados || []);
      } catch (error) {
        console.error('Erro ao buscar dados do laboratório:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [lab_id]);

  // Funções de ação
  const handleLigar = () => {
      if(labInfo?.lab_telefone) Linking.openURL(`tel:${labInfo.lab_telefone}`);
  };

  const handleEmail = () => {
      if(labInfo?.lab_email) Linking.openURL(`mailto:${labInfo.lab_email}`);
  };

  // --- Renderização dos Medicamentos ---
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

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#2A7CC7" />
          <Text style={styles.emptyText}>Carregando informações...</Text>
        </View>
      );
    }
    
    if (medicamentos.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.medicamentoImagemTexto}>💊</Text>
          <Text style={styles.emptyText}>Nenhum medicamento encontrado.</Text>
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
        
        {/* Banner Superior */}
        <View style={styles.bannerGrandeContainer}>
          <Image source={imageSource} style={styles.bannerGrandeImagem} resizeMode="cover" blurRadius={2} />
          <View style={styles.bannerOverlay} />
          <View style={styles.perfilContainer}>
            <View style={styles.perfilImagemWrapper}>
              <Image source={imageSource} style={styles.perfilImagem} resizeMode="contain" />
            </View>
            <View style={styles.favoritosContainer}>
               <Text style={[styles.favoritosText, { marginLeft: 0 }]}>{nome}</Text>
            </View>
          </View>
        </View>

        {/* --- NOVA SEÇÃO: INFORMAÇÕES DO LABORATÓRIO --- */}
        {labInfo && (
            <View style={styles.infoCard}>
                {/* Endereço e Cidade */}
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color="#2A7CC7" style={{marginTop: 2}} />
                    <View style={styles.infoTexts}>
                        <Text style={styles.infoLabel}>Endereço</Text>
                        <Text style={styles.infoValue}>
                            {labInfo.lab_endereco ? labInfo.lab_endereco : 'Endereço não informado'}
                            {labInfo.cidade_nome ? ` - ${labInfo.cidade_nome}` : ''}
                            {labInfo.uf_sigla ? `/${labInfo.uf_sigla}` : ''}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.divider} />

                <View style={styles.contactRow}>
                    {/* Telefone */}
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

                    {/* Email */}
                    <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                        <View style={[styles.iconCircle, { backgroundColor: '#F0FDF4' }]}>
                            <Ionicons name="mail" size={18} color="#16A34A" />
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.infoLabel}>E-mail</Text>
                            <Text style={styles.contactValue} numberOfLines={1} ellipsizeMode="tail">
                                {labInfo.lab_email || '---'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )}
        {/* ---------------------------------------------- */}

        <View style={styles.contadorContainer}>
          <Text style={styles.contadorText}>
            {medicamentos.length} produto{medicamentos.length !== 1 ? 's' : ''} listado{medicamentos.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {renderContent()}
        
        <View style={styles.espacoFinal} />
      </ScrollView>
    </View>
  );
}