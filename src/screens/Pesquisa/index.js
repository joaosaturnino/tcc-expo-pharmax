import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    FlatList, 
    TouchableOpacity, 
    Image,
    ActivityIndicator,
    Keyboard 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import api from '../../services/api';

// --- COLE A FUNÇÃO 'calcularPrecoPromocional' AQUI ---
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

// --- Hook de Debounce ---
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}
// --------------------------


export default function Pesquisa() {
    const navigation = useNavigation();
    const route = useRoute();
    
    const { termo: termoInicial } = route.params || {};

    const [searchText, setSearchText] = useState(termoInicial || '');
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false); 

    const debouncedSearchTerm = useDebounce(searchText, 500);

    const fetchResultados = useCallback(async (termo) => {
        if (termo.trim().length === 0) {
            setResultados([]);
            setLoading(false);
            setHasSearched(true); 
            return;
        }
        
        setLoading(true);
        setHasSearched(true);
        try {
            const response = await api.get(`/medicamentos/todos?search=${termo}&limit=50`);
            setResultados(response.data.dados || []);
        } catch (error) {
            console.error('Erro ao buscar resultados da pesquisa:', error);
            setResultados([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResultados(debouncedSearchTerm);
    }, [debouncedSearchTerm, fetchResultados]);


    const clearSearch = () => {
        setSearchText('');
        setResultados([]);
        setHasSearched(false);
    };

    // --- renderProduto ATUALIZADO ---
    const renderProduto = ({ item }) => {
        const nomeMed = item.med_nome || item.nome;
        const marca = item.lab_nome || item.marca;

        const promo = calcularPrecoPromocional(item);

        const imagemOrigem = item.med_imagem || item.imagem;
        const imageSource = typeof imagemOrigem === 'string'
        ? { uri: imagemOrigem } 
        : imagemOrigem || require('../../../public/paracetamol.png');

        return (
        <TouchableOpacity
            style={[styles.produtoCard, promo.estaEmPromocao && styles.produtoCardEmPromocao]}
            onPress={() => navigation.navigate('Produto', { produto: item })}
        >
            {promo.estaEmPromocao && (
            <View style={styles.promoBadge}>
                <Text style={styles.promoBadgeTexto}>{promo.descontoPorcento}% OFF</Text>
            </View>
            )}
            <View style={styles.produtoImagem}>
            <Image source={imageSource} style={styles.produtoImagemReal} resizeMode="contain" />
            </View>
            <Text style={styles.produtoNome} numberOfLines={1}>{nomeMed}</Text>
            <Text style={styles.produtoMarca}>{marca}</Text>

            {promo.estaEmPromocao ? (
            <>
                <Text style={styles.produtoPrecoAntigo}>R$ {promo.precoOriginal}</Text>
                <Text style={styles.produtoPreco}>R$ {promo.precoComDesconto}</Text>
            </>
            ) : (
            <Text style={styles.produtoPreco}>R$ {promo.precoOriginal}</Text>
            )}
        </TouchableOpacity>
        );
    };
    // ------------------------------------

    const renderSkeleton = () => (
        <View style={[styles.produtoCard, styles.skeletonCard]}>
            <View style={[styles.produtoImagem, styles.skeletonElement]} />
            <View style={[styles.skeletonElement, { width: '80%', height: 16, marginBottom: 6 }]} />
            <View style={[styles.skeletonElement, { width: '50%', height: 14, marginBottom: 8 }]} />
            <View style={[styles.skeletonElement, { width: '60%', height: 18 }]} />
        </View>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <FlatList
                    data={[1, 2, 3, 4, 5, 6]}
                    renderItem={renderSkeleton}
                    keyExtractor={item => `skeleton-${item}`}
                    numColumns={2}
                    contentContainerStyle={styles.listContainer}
                />
            );
        }
        
        if (hasSearched && resultados.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>💊</Text>
                    <Text style={styles.emptyText}>
                        {searchText.trim().length > 0 
                            ? `Nenhum resultado encontrado para "${searchText}"`
                            : "Digite o nome de um produto para buscar"}
                    </Text>
                </View>
            );
        }

        return (
            <FlatList
                data={resultados}
                renderItem={renderProduto}
                keyExtractor={item => String(item.med_id || item.medp_id)}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                onScrollBeginDrag={() => Keyboard.dismiss()}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#2c3e50" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Resultados da Pesquisa</Text>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar produto..."
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={setSearchText}
                    returnKeyType="search"
                    autoFocus={true}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={22} color="#999" />
                    </TouchableOpacity>
                )}
            </View>
            
            {renderContent()}
        </View>
    );
}