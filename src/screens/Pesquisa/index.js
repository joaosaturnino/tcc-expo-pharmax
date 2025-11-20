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
    ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import api from '../../services/api';

// --- CONFIGURAÇÃO DE IP E IMAGENS ---
const SERVER_IP = '192.168.200.27:3334';
const BASE_URL = `http://${SERVER_IP}`;

// Helper robusto para corrigir URLs de imagem
const getImageUrl = (caminho, tipo = 'padrao') => {
    if (!caminho) return null;
    if (typeof caminho === 'string' && caminho.startsWith('http')) {
        return { uri: caminho };
    }
    if (typeof caminho === 'string') {
        const cleanPath = caminho.startsWith('/') ? caminho.substring(1) : caminho;
        return { uri: `${BASE_URL}/${cleanPath}` };
    }
    return null;
};

// --- HELPER: CÁLCULO DE PROMOÇÃO ---
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

// --- HOOK: DEBOUNCE (Delay na digitação) ---
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

    const [medicamentos, setMedicamentos] = useState([]);
    const [farmacias, setFarmacias] = useState([]);
    const [laboratorios, setLaboratorios] = useState([]);

    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const debouncedSearchTerm = useDebounce(searchText, 600);

    // --- FUNÇÃO DE BUSCA ---
    const fetchResultados = useCallback(async (termoBruto) => {
        // CORREÇÃO AQUI: Remove espaços do início e fim (trim)
        // Isso resolve o problema do autocompletar do teclado adicionar espaço extra
        const termo = termoBruto ? termoBruto.trim() : '';

        // Se o termo for vazio (mesmo que tivesse só espaços antes), limpa tudo
        if (termo.length === 0) {
            setMedicamentos([]);
            setFarmacias([]);
            setLaboratorios([]);
            setLoading(false);
            setHasSearched(false);
            return;
        }

        setLoading(true);
        setHasSearched(true);

        try {
            // Usa o 'termo' já limpo nas requisições
            const [resMed, resFarm, resLab] = await Promise.all([
                api.get(`/medicamentos/todos?search=${termo}&limit=50`),
                api.get('/farmacias'),
                api.get('/todoslab')
            ]);

            // 1. TRATAMENTO DE MEDICAMENTOS
            let listaMedicamentos = resMed.data.dados || [];

            listaMedicamentos.sort((a, b) => {
                const getPrecoReal = (item) => {
                    let preco = parseFloat(item.preco || item.medp_preco);
                    const promo = calcularPrecoPromocional(item);
                    if (promo.estaEmPromocao) {
                        const desconto = parseFloat(item.promo_desconto);
                        return preco * (1 - desconto / 100);
                    }
                    return preco;
                };
                return getPrecoReal(a) - getPrecoReal(b);
            });
            setMedicamentos(listaMedicamentos);

            // 2. TRATAMENTO DE FARMÁCIAS (Filtro Local usando termo limpo)
            const dadosFarm = resFarm.data.dados || [];
            const farmsFiltradas = dadosFarm.filter(f =>
                f.farm_nome.toLowerCase().includes(termo.toLowerCase())
            );
            setFarmacias(farmsFiltradas);

            // 3. TRATAMENTO DE LABORATÓRIOS (Filtro Local usando termo limpo)
            let dadosLab = resLab.data.dados || resLab.data || [];
            const labsFiltrados = dadosLab.filter(l =>
                (l.lab_nome || l.nome || '').toLowerCase().includes(termo.toLowerCase())
            );
            setLaboratorios(labsFiltrados);

        } catch (error) {
            console.error('Erro na pesquisa:', error);
            setMedicamentos([]);
            setFarmacias([]);
            setLaboratorios([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Dispara a busca sempre que o texto "debounced" mudar
    useEffect(() => {
        // O debounce passa o texto bruto, mas o fetchResultados agora faz o trim()
        fetchResultados(debouncedSearchTerm);
    }, [debouncedSearchTerm, fetchResultados]);

    const clearSearch = () => {
        setSearchText('');
        setMedicamentos([]);
        setFarmacias([]);
        setLaboratorios([]);
        setHasSearched(false);
    };

    // --- RENDERIZAÇÃO: MEDICAMENTO ---
    const renderMedicamento = ({ item }) => {
        const nomeMed = item.med_nome || item.nome;
        const marca = item.lab_nome || item.marca;
        const promo = calcularPrecoPromocional(item);

        const imagemOrigem = item.med_imagem || item.imagem;
        const sourceValidado = getImageUrl(imagemOrigem);
        const imageSource = sourceValidado || require('../../../public/caixa-medicamento-padrao5.png');

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
                    <View>
                        <Text style={styles.produtoPrecoAntigo}>R$ {promo.precoOriginal}</Text>
                        <Text style={styles.produtoPreco}>R$ {promo.precoComDesconto}</Text>
                    </View>
                ) : (
                    <Text style={styles.produtoPreco}>R$ {promo.precoOriginal}</Text>
                )}
            </TouchableOpacity>
        );
    };

    // --- RENDERIZAÇÃO: FARMÁCIA ---
    const renderFarmacia = ({ item }) => {
        const sourceValidado = getImageUrl(item.farm_logo_url);
        const imageSource = sourceValidado || require('../../../public/logo.png');

        return (
            <TouchableOpacity
                style={styles.entidadeCard}
                onPress={() => navigation.navigate('Farmacia', {
                    farm_id: item.farm_id,
                    nome: item.farm_nome,
                    imagemFarmacia: item.farm_logo_url
                })}
            >
                <View style={styles.entidadeImagemContainer}>
                    <Image source={imageSource} style={styles.entidadeImagem} resizeMode="contain" />
                </View>
                <Text style={styles.entidadeNome} numberOfLines={1}>{item.farm_nome}</Text>
                <Text style={styles.entidadeTipo}>Farmácia</Text>
            </TouchableOpacity>
        );
    };

    // --- RENDERIZAÇÃO: LABORATÓRIO ---
    const renderLaboratorio = ({ item }) => {
        const nomeLab = item.lab_nome || item.nome;
        const imgUrl = item.lab_logo_url || item.lab_logo;
        const sourceValidado = getImageUrl(imgUrl);
        const imageSource = sourceValidado || require('../../../public/logo.png');

        return (
            <TouchableOpacity
                style={styles.entidadeCard}
                onPress={() => navigation.navigate('Laboratorio', {
                    lab_id: item.lab_id,
                    nome: nomeLab,
                    imagemLaboratorio: imgUrl
                })}
            >
                <View style={styles.entidadeImagemContainer}>
                    <Image source={imageSource} style={styles.entidadeImagem} resizeMode="contain" />
                </View>
                <Text style={styles.entidadeNome} numberOfLines={1}>{nomeLab}</Text>
                <Text style={styles.entidadeTipo}>Laboratório</Text>
            </TouchableOpacity>
        );
    };

    // --- CONTEÚDO PRINCIPAL ---
    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color="#2A7CC7" />
                    <Text style={styles.emptyText}>Buscando...</Text>
                </View>
            );
        }

        const totalResultados = medicamentos.length + farmacias.length + laboratorios.length;

        if (hasSearched && totalResultados === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>🔍</Text>
                    <Text style={styles.emptyText}>
                        Nenhum resultado encontrado para "{searchText}"
                    </Text>
                </View>
            );
        }

        return (
            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                onScrollBeginDrag={Keyboard.dismiss}
            >
                {farmacias.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Farmácias</Text>
                        <FlatList
                            data={farmacias}
                            renderItem={renderFarmacia}
                            keyExtractor={item => `farm-${item.farm_id}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 16 }}
                        />
                    </View>
                )}

                {laboratorios.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Laboratórios</Text>
                        <FlatList
                            data={laboratorios}
                            renderItem={renderLaboratorio}
                            keyExtractor={item => `lab-${item.lab_id || item.id}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 16 }}
                        />
                    </View>
                )}

                {medicamentos.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Medicamentos</Text>
                        <View style={styles.gridContainer}>
                            {medicamentos.map(item => (
                                <View key={`med-${item.med_id}`} style={{ width: '50%' }}>
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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#2c3e50" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pesquisar</Text>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar produto, farmácia..."
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={setSearchText}
                    returnKeyType="search"
                    autoFocus={!termoInicial}
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