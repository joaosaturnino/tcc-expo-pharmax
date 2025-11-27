import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import api from '../../services/api';

const DEFAULT_FARMACIA_IMAGE = 'http://172.16.0.34:3334/public/farmacias/padrao.png';

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

export default function Farmacia() {
  const route = useRoute();
  const navigation = useNavigation();

  const { nome, imagemFarmacia, farm_id } = route.params || {};

  // Estados da Tela
  const [farmInfo, setFarmInfo] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFavorito, setIsFavorito] = useState(false);

  // Estados da Avaliação
  const [mediaAvaliacao, setMediaAvaliacao] = useState({ media: 0, total: 0 });
  const [todasAvaliacoes, setTodasAvaliacoes] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false);
  
  // Dados do Formulário de Avaliação
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [idAvaliacaoUsuario, setIdAvaliacaoUsuario] = useState(null); // Se != null, é edição
  
  const [userId, setUserId] = useState(null);
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);

  const favoritosCount = 1250; 

  useLayoutEffect(() => {
    navigation.setOptions({
      title: nome || 'Farmácia',
      headerBackTitleVisible: false,
    });
  }, [navigation, nome]);

  const imageSource = (typeof imagemFarmacia === 'string' && imagemFarmacia.startsWith('http'))
    ? { uri: imagemFarmacia }
    : { uri: DEFAULT_FARMACIA_IMAGE };

  // --- Lógica de Busca de Dados ---
  const carregarDados = async () => {
    if (!farm_id) return;

    try {
      // 1. Detalhes
      const resInfo = await api.get(`/farmacias/${farm_id}`);
      if (resInfo.data.sucesso && resInfo.data.dados) {
        const dados = Array.isArray(resInfo.data.dados) ? resInfo.data.dados[0] : resInfo.data.dados;
        setFarmInfo(dados);
      }

      // 2. Avaliações (Baixa todas para calcular média e checar se usuário já avaliou)
      const resAva = await api.get(`/avaliacao?farmacia_id=${farm_id}`);
      
      if (resAva.data.sucesso && resAva.data.dados) {
        const avaliacoes = resAva.data.dados;
        setTodasAvaliacoes(avaliacoes); 

        if (avaliacoes.length > 0) {
          const soma = avaliacoes.reduce((acc, curr) => {
            const notaSegura = Number(curr.ava_nota) || 0; 
            return acc + notaSegura;
          }, 0);

          const media = soma / avaliacoes.length;

          if (isNaN(media)) {
             setMediaAvaliacao({ media: 0, mediaFormatada: '0,0', total: 0 });
          } else {
             setMediaAvaliacao({
                media: media, 
                mediaFormatada: media.toFixed(1).replace('.', ','),
                total: avaliacoes.length
             });
          }
        } else {
          setMediaAvaliacao({ media: 0, mediaFormatada: '0,0', total: 0 });
        }
      }

      // 3. Medicamentos
      const urlMed = `/medicamentos?farmacia_id=${farm_id}`;
      const resMed = await api.get(urlMed);
      const listaRaw = resMed.data.dados || [];
      const medicamentosAtivos = listaRaw.filter(item => item.med_ativo === 1);
      setMedicamentos(medicamentosAtivos);

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setMedicamentos([]);
    }
  };

  // Busca Usuário Local
  useEffect(() => {
    const getUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('usuario_info');
        if (userJson) {
          const user = JSON.parse(userJson);
          const idRecuperado = user.usu_id || user.id;
          if (idRecuperado) setUserId(idRecuperado);
        }
      } catch (e) {
        console.log('Erro ao pegar usuário', e);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    setLoading(true);
    carregarDados().finally(() => setLoading(false));
  }, [farm_id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  }, [farm_id]);

  // Verifica Favorito
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

  // --- FUNÇÃO INTELIGENTE: Abrir Modal ---
  // Verifica se o usuário já avaliou para decidir se é Cadastro ou Edição
  const abrirModalAvaliacao = () => {
    if (!userId) {
        Alert.alert('Login Necessário', 'Você precisa estar logado para avaliar.');
        return;
    }

    // Busca na lista de avaliações se tem uma com meu ID
    const minhaAvaliacao = todasAvaliacoes.find(a => a.usuario_id === userId);

    if (minhaAvaliacao) {
        // MODO EDIÇÃO
        setNota(minhaAvaliacao.ava_nota);
        setComentario(minhaAvaliacao.ava_comentario || '');
        setIdAvaliacaoUsuario(minhaAvaliacao.ava_id); // Guarda o ID para exclusão
    } else {
        // MODO CADASTRO
        setNota(0);
        setComentario('');
        setIdAvaliacaoUsuario(null);
    }
    
    setModalVisible(true);
  };

  // --- Enviar (Back-end lida com Upsert) ---
  const handleEnviarAvaliacao = async () => {
    if (nota === 0) {
      Alert.alert('Atenção', 'Por favor, selecione uma nota de 1 a 5 estrelas.');
      return;
    }

    setEnviandoAvaliacao(true);
    try {
      const payload = {
        usuario_id: userId,
        farmacia_id: farm_id,
        ava_nota: nota,
        ava_comentario: comentario
      };

      const response = await api.post('/avaliacao', payload);

      if (response.data.sucesso) {
        Alert.alert('Sucesso', response.data.mensagem || 'Avaliação salva!');
        setModalVisible(false);
        carregarDados(); // Atualiza a tela
      }
    } catch (error) {
      console.error('Erro ao avaliar:', error);
      Alert.alert('Erro', 'Falha na comunicação com o servidor.');
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

  // --- Excluir Avaliação ---
  const handleExcluirAvaliacao = async () => {
    if (!idAvaliacaoUsuario) return;

    Alert.alert(
        'Excluir Avaliação',
        'Tem certeza que deseja apagar sua avaliação?',
        [
            { text: 'Cancelar', style: 'cancel' },
            { 
                text: 'Apagar', 
                style: 'destructive',
                onPress: async () => {
                    setEnviandoAvaliacao(true);
                    try {
                        const response = await api.delete(`/avaliacao/${idAvaliacaoUsuario}`);
                        
                        if (response.data.sucesso) {
                            Alert.alert('Sucesso', 'Sua avaliação foi removida.');
                            setModalVisible(false);
                            setNota(0);
                            setComentario('');
                            setIdAvaliacaoUsuario(null);
                            carregarDados(); 
                        } else {
                            Alert.alert('Erro', response.data.mensagem || 'Não foi possível excluir.');
                        }
                    } catch (error) {
                        console.error('Erro ao excluir:', error);
                        Alert.alert('Erro', 'Falha ao excluir avaliação.');
                    } finally {
                        setEnviandoAvaliacao(false);
                    }
                }
            }
        ]
    );
  };

  const handleLigar = () => {
    if (farmInfo?.farm_telefone) Linking.openURL(`tel:${farmInfo.farm_telefone}`);
  };

  const handleEmail = () => {
    if (farmInfo?.farm_email) Linking.openURL(`mailto:${farmInfo.farm_email}`);
  };

  // --- RENDERIZAÇÃO ---

  const renderModalAvaliacao = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>
              {idAvaliacaoUsuario ? "Editar Avaliação" : "Como foi sua experiência?"}
          </Text>
          
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity 
                key={star} 
                onPress={() => setNota(star)}
                style={styles.starButton}
              >
                <Ionicons 
                  name={star <= nota ? "star" : "star-outline"} 
                  size={36} 
                  color="#F59E0B" 
                />
              </TouchableOpacity>
            ))}
          </View>
          
          <TextInput
            style={styles.inputComentario}
            placeholder="Escreva um comentário (opcional)..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            value={comentario}
            onChangeText={setComentario}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.btnCancelar} 
              onPress={() => setModalVisible(false)}
              disabled={enviandoAvaliacao}
            >
              <Text style={[styles.btnTexto, { color: '#64748B' }]}>Cancelar</Text>
            </TouchableOpacity>

            {/* Botão Excluir (Só aparece se for edição) */}
            {idAvaliacaoUsuario && (
                <TouchableOpacity 
                  style={styles.btnExcluir} 
                  onPress={handleExcluirAvaliacao}
                  disabled={enviandoAvaliacao}
                >
                  <Ionicons name="trash-outline" size={20} color="#FFF" />
                </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.btnConfirmar} 
              onPress={handleEnviarAvaliacao}
              disabled={enviandoAvaliacao}
            >
              {enviandoAvaliacao ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={[styles.btnTexto, { color: '#FFF' }]}>
                    {idAvaliacaoUsuario ? "Atualizar" : "Enviar"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );

  const renderHeader = () => (
    <View>
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

      {farmInfo && (
        <View style={styles.infoCard}>
          {mediaAvaliacao.total > 0 ? (
            <View style={styles.notaContainer}>
                <Text style={styles.notaValor}>{mediaAvaliacao.mediaFormatada}</Text>
                <View style={styles.notaEstrelasRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons key={star} name={star <= Math.round(mediaAvaliacao.media) ? "star" : "star-outline"} size={18} color="#F59E0B" />
                    ))}
                </View>
                <Text style={styles.notaTotalAvaliacoes}>({mediaAvaliacao.total} avaliações)</Text>
            </View>
          ) : (
             <View style={[styles.notaContainer, { backgroundColor: '#F1F5F9' }]}>
                 <Text style={[styles.notaTotalAvaliacoes, { color: '#64748B' }]}>Nenhuma avaliação ainda</Text>
             </View>
          )}

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
                <Text style={styles.contactValue}>{farmInfo.farm_telefone || '---'}</Text>
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

          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={styles.avaliarBtn}
            onPress={abrirModalAvaliacao}
          >
            <Ionicons name="star" size={20} color="#fff" />
            <Text style={styles.avaliarBtnTexto}>Avaliar Farmácia</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.contadorContainer}>
        <Text style={styles.contadorText}>
          {medicamentos.length} medicamento{medicamentos.length !== 1 ? 's' : ''} encontrado{medicamentos.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );

  const renderMedicamento = ({ item }) => {
    const nomeMed = item.med_nome || item.nome;
    const marca = item.lab_nome || item.marca;
    const categoria = item.tipo_nome || item.categoria || 'Medicamento';
    const promo = calcularPrecoPromocional(item);

    const imagemOrigem = item.med_imagem || item.imagem;
    const prodImageSource = (typeof imagemOrigem === 'string' && imagemOrigem.startsWith('http'))
      ? { uri: imagemOrigem }
      : { uri: 'http://172.16.0.34:3334/public/logo.png' };

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
      <FlatList
        data={medicamentos}
        renderItem={renderMedicamento}
        keyExtractor={item => String(item.med_id)}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.medicamentoImagemTexto}>💊</Text>
            <Text style={styles.emptyText}>Nenhum medicamento encontrado nesta farmácia</Text>
          </View>
        }
        contentContainerStyle={styles.medicamentosList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2A7CC7']}
            tintColor="#2A7CC7"
          />
        }
      />
      {renderModalAvaliacao()}
    </View>
  );
}