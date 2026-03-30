import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Keyboard,
    ScrollView,
    LayoutAnimation, 
    Platform,
    UIManager,
    RefreshControl 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import api from '../../services/api';

// Configuração IP
const SERVER_IP = '10.101.130.164:3334';
const BASE_URL = `http://${SERVER_IP}`;

// Helper Imagens
const getImageUrl = (caminho) => {
    if (!caminho) return null;
    if (typeof caminho === 'string' && caminho.startsWith('http')) return { uri: caminho };
    if (typeof caminho === 'string') {
        const cleanPath = caminho.startsWith('/') ? caminho.substring(1) : caminho;
        return { uri: `${BASE_URL}/${cleanPath}` };
    }
    return null;
};

// Helper Promoção
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
        return {
            precoOriginal: precoOriginal.toFixed(2).replace('.', ','),
            precoComDesconto: precoComDesconto.toFixed(2).replace('.', ','),
            estaEmPromocao: true,
            descontoPorcento: desconto
        };
    }
    return { precoOriginal: precoOriginal.toFixed(2).replace('.', ','), precoComDesconto: null, estaEmPromocao: false, descontoPorcento: 0 };
}

// Hook Debounce
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function Pesquisa() {
    const navigation = useNavigation();
    const route = useRoute();

    const { termo: termoInicial } = route.params || {};
    const [searchText, setSearchText] = useState(termoInicial || '');
    const [filter, setFilter] = useState('todos');

    const [medicamentos, setMedicamentos] = useState([]);
    const [farmacias, setFarmacias] = useState([]);
    const [laboratorios, setLaboratorios] = useState([]);

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const debouncedSearchTerm = useDebounce(searchText, 600);

    const filterOptions = [
        { id: 'todos', label: 'Tudo' },
        { id: 'med', label: 'Medicamentos' },
        { id: 'farm', label: 'Farmácias' },
        { id: 'lab', label: 'Laboratórios' },
    ];

    const handleFilterChange = (newFilter) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFilter(newFilter);
    };

    const fetchResultados = useCallback(async (termoBruto, isRefresh = false) => {
        const termo = termoBruto ? termoBruto.trim() : '';

        if (termo.length === 0) {
            setMedicamentos([]);
            setFarmacias([]);
            setLaboratorios([]);
            setLoading(false);
            setHasSearched(false);
            handleFilterChange('todos');
            return;
        }

        if (!isRefresh) setLoading(true);
        
        setHasSearched(true);

        try {
            const [resMed, resFarm, resLab] = await Promise.all([
                api.get(`/medicamentos/todos?search=${termo}&limit=50`),
                api.get('/farmacias'),
                api.get('/todoslab')
            ]);

            // Medicamentos
            let listaMedicamentos = resMed.data.dados || [];
            listaMedicamentos.sort((a, b) => {
                const getPreco = (item) => {
                    let p = parseFloat(item.preco || item.medp_preco);
                    const promo = calcularPrecoPromocional(item);
                    return promo.estaEmPromocao ? p * (1 - parseFloat(item.promo_desconto) / 100) : p;
                };
                return getPreco(a) - getPreco(b);
            });
            setMedicamentos(listaMedicamentos);

            // Farmácias
            const dadosFarm = resFarm.data.dados || [];
            setFarmacias(dadosFarm.filter(f => f.farm_nome.toLowerCase().includes(termo.toLowerCase())));

            // Laboratórios
            let dadosLab = resLab.data.dados || resLab.data || [];
            setLaboratorios(dadosLab.filter(l => (l.lab_nome || l.nome || '').toLowerCase().includes(termo.toLowerCase())));

        } catch (error) {
            console.error(error);
        } finally {
            if (!isRefresh) setLoading(false);
        }
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchResultados(searchText, true);
        setRefreshing(false);
    }, [fetchResultados, searchText]);

    useEffect(() => {
        fetchResultados(debouncedSearchTerm);
    }, [debouncedSearchTerm, fetchResultados]);

    const clearSearch = () => {
        setSearchText('');
        handleFilterChange('todos');
    };

    const renderMedicamento = ({ item }) => {
        const promo = calcularPrecoPromocional(item);
        const source = getImageUrl(item.med_imagem || item.imagem);
        const imageSource = source || require('../../../public/caixa-medicamento-padrao5.png');

        // --- NOVO: Captura o nome da farmácia ---
        const farmacia = item.farm_nome || 'Farmácia Parceira';

        return (
            <TouchableOpacity
                style={[styles.produtoCard, promo.estaEmPromocao && styles.produtoCardEmPromocao]}
                onPress={() => navigation.navigate('Produto', { produto: item })}
                activeOpacity={0.9}
            >
                {promo.estaEmPromocao && (
                    <View style={styles.promoBadge}>
                        <Text style={styles.promoBadgeTexto}>{Math.round(promo.descontoPorcento)}% OFF</Text>
                    </View>
                )}
                <View style={styles.produtoImagem}>
                    <Image source={imageSource} style={styles.produtoImagemReal} resizeMode="contain" />
                </View>

                <Text style={styles.produtoNome} numberOfLines={2}>{item.med_nome || item.nome}</Text>
                <Text style={styles.produtoMarca}>{item.lab_nome || item.marca}</Text>

                {/* --- NOVO: Exibe o nome da farmácia --- */}
                <Text style={styles.produtoFarmacia} numberOfLines={1}> {farmacia}</Text>

                <View style={styles.priceTag}>
                    {promo.estaEmPromocao && (
                        <Text style={styles.produtoPrecoAntigo}>R$ {promo.precoOriginal}</Text>
                    )}
                    <Text style={[styles.produtoPreco, promo.estaEmPromocao && { color: '#EF4444' }]}>
                        R$ {promo.estaEmPromocao ? promo.precoComDesconto : promo.precoOriginal}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEntidade = ({ item, tipo }) => {
        const isFarm = tipo === 'farm';
        const imgUrl = isFarm ? item.farm_logo_url : (item.lab_logo_url || item.lab_logo);
        const nome = isFarm ? item.farm_nome : (item.lab_nome || item.nome);
        const source = getImageUrl(imgUrl) || require('../../../public/logo.png');

        return (
            <TouchableOpacity
                style={styles.entidadeCard}
                onPress={() => navigation.navigate(isFarm ? 'Farmacia' : 'Laboratorio', isFarm ? { farm_id: item.farm_id, nome, imagemFarmacia: imgUrl } : { lab_id: item.lab_id, nome, imagemLaboratorio: imgUrl })}
                activeOpacity={0.8}
            >
                <View style={styles.entidadeImagemContainer}>
                    <Image source={source} style={styles.entidadeImagem} resizeMode="contain" />
                </View>
                <Text style={styles.entidadeNome} numberOfLines={2}>{nome}</Text>
                <Text style={styles.entidadeTipo}>{isFarm ? 'Farmácia' : 'Laboratório'}</Text>
            </TouchableOpacity>
        );
    };

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color="#2A7CC7" />
                    <Text style={{ marginTop: 10, color: '#999' }}>Buscando resultados...</Text>
                </View>
            );
        }

        const showFarmacias = (filter === 'todos' || filter === 'farm') && farmacias.length > 0;
        const showLaboratorios = (filter === 'todos' || filter === 'lab') && laboratorios.length > 0;
        const showMedicamentos = (filter === 'todos' || filter === 'med') && medicamentos.length > 0;

        if (hasSearched && !showFarmacias && !showLaboratorios && !showMedicamentos) {
            return (
                <ScrollView 
                    contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2A7CC7']} />
                    }
                >
                    <Ionicons name="search-outline" style={styles.emptyIcon} />
                    <Text style={styles.emptyText}>Nenhum resultado encontrado.</Text>
                    <Text style={{fontSize: 12, color: '#ccc', marginTop: 10}}>Puxe para atualizar</Text>
                </ScrollView>
            );
        }

        return (
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScrollBeginDrag={Keyboard.dismiss}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh}
                        colors={['#2A7CC7']}
                        tintColor="#2A7CC7"
                    />
                }
            >
                {showFarmacias && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Farmácias</Text>
                            <View style={styles.sectionBadge}><Text style={styles.sectionBadgeText}>{farmacias.length}</Text></View>
                        </View>
                        <FlatList
                            data={farmacias}
                            renderItem={({ item }) => renderEntidade({ item, tipo: 'farm' })}
                            keyExtractor={item => `farm-${item.farm_id}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 16 }}
                        />
                    </View>
                )}

                {showLaboratorios && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Laboratórios</Text>
                            <View style={styles.sectionBadge}><Text style={styles.sectionBadgeText}>{laboratorios.length}</Text></View>
                        </View>
                        <FlatList
                            data={laboratorios}
                            renderItem={({ item }) => renderEntidade({ item, tipo: 'lab' })}
                            keyExtractor={item => `lab-${item.lab_id || item.id}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 16 }}
                        />
                    </View>
                )}

                {showMedicamentos && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Medicamentos</Text>
                            <View style={styles.sectionBadge}><Text style={styles.sectionBadgeText}>{medicamentos.length}</Text></View>
                        </View>
                        <View style={styles.gridContainer}>
                            {medicamentos.map(item => (
                                <View key={`med-${item.med_id}`}>
                                    {renderMedicamento({ item })}
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerTopRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#1e293b" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Explorar</Text>
                </View>

                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color="#94A3B8" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="O que você procura hoje?"
                        placeholderTextColor="#94A3B8"
                        value={searchText}
                        onChangeText={setSearchText}
                        returnKeyType="search"
                        autoFocus={!termoInicial}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={20} color="#94A3B8" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {hasSearched && (
                <View style={{ backgroundColor: '#fff', zIndex: 90 }}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        style={styles.filterScrollView}
                        contentContainerStyle={styles.filterContentContainer}
                    >
                        {filterOptions.map((opt) => (
                            <TouchableOpacity
                                key={opt.id}
                                style={[
                                    styles.filterButton,
                                    filter === opt.id && styles.filterButtonActive
                                ]}
                                onPress={() => handleFilterChange(opt.id)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.filterText,
                                    filter === opt.id && styles.filterTextActive
                                ]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {renderContent()}
        </View>
    );
}