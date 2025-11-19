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

// --- Função Helper de Promoção ---
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

// --- Hook de Debounce ---
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

    const fetchResultados = useCallback(async (termo) => {
        if (!termo || termo.trim().length === 0) {
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
            // Busca em paralelo: Medicamentos, Farmácias e Laboratórios
            const [resMed, resFarm, resLab] = await Promise.all([
                api.get(`/medicamentos/todos?search=${termo}&limit=50`),
                api.get('/farmacias'),
                api.get('/todoslab')
            ]);

            setMedicamentos(resMed.data.dados || []);

            // Filtra Farmácias localmente pelo nome
            const dadosFarm = resFarm.data.dados || [];
            const farmsFiltradas = dadosFarm.filter(f => f.farm_nome.toLowerCase().includes(termo.toLowerCase()));
            setFarmacias(farmsFiltradas);

            // Filtra Laboratórios localmente pelo nome
            let dadosLab = resLab.data.dados || resLab.data || [];
            const labsFiltrados = dadosLab.filter(l => (l.lab_nome || l.nome).toLowerCase().includes(termo.toLowerCase()));
            setLaboratorios(labsFiltrados);

        } catch (error) {
            console.error('Erro ao buscar resultados:', error);
            setMedicamentos([]);
            setFarmacias([]);
            setLaboratorios([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResultados(debouncedSearchTerm);
    }, [debouncedSearchTerm, fetchResultados]);

    const clearSearch = () => {
        setSearchText('');
        setMedicamentos([]);
        setFarmacias([]);
        setLaboratorios([]);
        setHasSearched(false);
    };

    // --- CARD DE MEDICAMENTO ---
    const renderMedicamento = ({ item }) => {
        const nomeMed = item.med_nome || item.nome;
        const marca = item.lab_nome || item.marca;
        const promo = calcularPrecoPromocional(item);
        const imagemOrigem = item.med_imagem || item.imagem;
        const imageSource = typeof imagemOrigem === 'string' && imagemOrigem.startsWith('http')
            ? { uri: imagemOrigem }
            : require('../../../public/caixa-medicamento-padrao5.png');

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

    // --- CARD DE FARMÁCIA ---
    const renderFarmacia = ({ item }) => {
        const imageSource = item.farm_logo_url ? { uri: item.farm_logo_url } : require('../../../public/logo.png');
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

    // --- CARD DE LABORATÓRIO ---
    const renderLaboratorio = ({ item }) => {
        const nomeLab = item.lab_nome || item.nome;
        const imgUrl = item.lab_logo_url || item.lab_logo;
        const imageSource = imgUrl ? { uri: imgUrl } : require('../../../public/logo.png');
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

    // --- RENDERIZAÇÃO PRINCIPAL ---
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
                {/* LISTA HORIZONTAL DE FARMÁCIAS */}
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

                {/* LISTA HORIZONTAL DE LABORATÓRIOS */}
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

                {/* GRADE VERTICAL DE MEDICAMENTOS */}
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