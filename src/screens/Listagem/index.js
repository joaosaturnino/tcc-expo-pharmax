import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StyleSheet,
    RefreshControl
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../services/api';

// --- CONFIGURAÇÃO GLOBAL ---
const SERVER_IP = '192.168.200.27:3334';
const BASE_URL = `http://${SERVER_IP}`;

// --- HELPER: URL IMAGEM ---
const getImageUrl = (caminho, tipo) => {
    if (!caminho) {
        if (tipo === 'medicamento') return { uri: `${BASE_URL}/public/medicamentos/caixa-medicamento-padrao5.png` };
        const pasta = tipo === 'farmacia' ? 'farmacias' : 'laboratorios';
        return { uri: `${BASE_URL}/public/${pasta}/logo.png` };
    }
    if (typeof caminho === 'string' && caminho.startsWith('http')) {
        return { uri: caminho };
    }
    if (typeof caminho === 'string') {
        const cleanPath = caminho.startsWith('/') ? caminho.substring(1) : caminho;
        return { uri: `${BASE_URL}/${cleanPath}` };
    }
    return null;
};

// --- HELPER: PROMOÇÃO ---
function calcularPrecoPromocional(item) {
    const precoOriginal = parseFloat(item.preco || item.medp_preco);
    const desconto = parseFloat(item.promo_desconto);

    if (isNaN(precoOriginal) || !desconto || desconto <= 0 || !item.promo_inicio || !item.promo_fim) {
        return { precoOriginal: isNaN(precoOriginal) ? ' --,--' : precoOriginal.toFixed(2).replace('.', ','), precoComDesconto: null, estaEmPromocao: false };
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
    return { precoOriginal: precoOriginal.toFixed(2).replace('.', ','), precoComDesconto: null, estaEmPromocao: false };
}

export default function Listagem() {
    const navigation = useNavigation();
    const route = useRoute();

    // Aceita 'farmacia', 'laboratorio' ou 'medicamento'
    const { tipo, titulo } = route.params || {};

    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: titulo || 'Listagem',
            headerBackTitleVisible: false,
        });
    }, [navigation, titulo]);

    const buscarDados = async () => {
        try {
            let url = '';
            // --- LÓGICA DE ROTAS ---
            if (tipo === 'farmacia') {
                url = '/farmacias';
            } else if (tipo === 'laboratorio') {
                url = "/todoslab";
            } else if (tipo === 'medicamento') {
                // Rota para buscar todos os medicamentos (exemplo: destaques ou busca geral)
                url = "/medicamentos/todos?limit=50"; 
            }

            if (!url) return;

            const response = await api.get(url);
            const lista = response.data.dados || response.data || [];
            setDados(lista);

        } catch (error) {
            console.error('Erro ao buscar listagem:', error);
        }
    };

    useEffect(() => {
        setLoading(true);
        buscarDados().finally(() => setLoading(false));
    }, [tipo]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await buscarDados();
        setRefreshing(false);
    }, [tipo]);

    // --- RENDER: FARMÁCIA ---
    const renderFarmacia = ({ item }) => {
        const imageSource = getImageUrl(item.farm_logo_url, 'farmacia');
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Farmacia', {
                    farm_id: item.farm_id,
                    nome: item.farm_nome,
                    imagemFarmacia: item.farm_logo_url
                })}
            >
                <Image source={imageSource} style={styles.imagem} resizeMode="contain" />
                <View style={styles.info}>
                    <Text style={styles.nome}>{item.farm_nome}</Text>
                    <Text style={styles.subtitulo}>Ver produtos e ofertas</Text>
                </View>
                <Text style={styles.seta}>›</Text>
            </TouchableOpacity>
        );
    };

    // --- RENDER: LABORATÓRIO ---
    const renderLaboratorio = ({ item }) => {
        const nomeLab = item.lab_nome || item.nome;
        const rawImage = item.lab_logo_url || item.lab_logo || item.logo;
        const imageSource = getImageUrl(rawImage, 'laboratorio');

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Laboratorio', {
                    lab_id: item.lab_id,
                    nome: nomeLab,
                    imagemLaboratorio: rawImage
                })}
            >
                <Image source={imageSource} style={styles.imagem} resizeMode="contain" />
                <View style={styles.info}>
                    <Text style={styles.nome}>{nomeLab}</Text>
                    <Text style={styles.subtitulo}>Ver catálogo completo</Text>
                </View>
                <Text style={styles.seta}>›</Text>
            </TouchableOpacity>
        );
    };

    // --- RENDER: MEDICAMENTO (NOVO) ---
    const renderMedicamento = ({ item }) => {
        const promo = calcularPrecoPromocional(item);
        const source = getImageUrl(item.med_imagem || item.imagem, 'medicamento');
        
        // --- AQUI ESTÁ A ALTERAÇÃO SOLICITADA ---
        const farmacia = item.farm_nome || 'Farmácia Parceira';

        return (
            <TouchableOpacity
                style={[styles.cardProduto, promo.estaEmPromocao && styles.cardProdutoPromo]}
                onPress={() => navigation.navigate('Produto', { produto: item })}
            >
                <Image source={source} style={styles.imagemProduto} resizeMode="contain" />
                
                <View style={styles.infoProduto}>
                    <Text style={styles.nomeProduto} numberOfLines={2}>{item.med_nome || item.nome}</Text>
                    <Text style={styles.marcaProduto}>{item.lab_nome || item.marca}</Text>
                    
                    {/* Exibindo o nome da farmácia */}
                    <Text style={styles.farmaciaProduto} numberOfLines={1}>🏪 {farmacia}</Text>

                    <View style={styles.priceContainer}>
                        {promo.estaEmPromocao && (
                            <Text style={styles.precoAntigo}>R$ {promo.precoOriginal}</Text>
                        )}
                        <Text style={[styles.precoAtual, promo.estaEmPromocao && { color: '#EF4444' }]}>
                            R$ {promo.estaEmPromocao ? promo.precoComDesconto : promo.precoOriginal}
                        </Text>
                    </View>
                </View>

                {promo.estaEmPromocao && (
                    <View style={styles.badgePromo}>
                        <Text style={styles.badgeTexto}>{Math.round(promo.descontoPorcento)}%</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    // --- DECISÃO DE QUAL RENDERIZADOR USAR ---
    const renderItem = ({ item }) => {
        if (tipo === 'farmacia') return renderFarmacia({ item });
        if (tipo === 'laboratorio') return renderLaboratorio({ item });
        if (tipo === 'medicamento') return renderMedicamento({ item });
        return null;
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2A7CC7" />
                <Text style={{ marginTop: 10, color: '#888' }}>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={dados}
                renderItem={renderItem}
                keyExtractor={item => String(item.farm_id || item.lab_id || item.med_id || Math.random())}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum item encontrado.</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#2A7CC7']}
                        tintColor="#2A7CC7"
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F4F7'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listContent: {
        padding: 16
    },
    // --- CARD PADRÃO (FARMÁCIA / LAB) ---
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    imagem: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f8f9fa',
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#eee'
    },
    info: {
        flex: 1
    },
    nome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50'
    },
    subtitulo: {
        fontSize: 13,
        color: '#7f8c8d',
        marginTop: 2
    },
    seta: {
        fontSize: 24,
        color: '#cbd5e1',
        fontWeight: '300'
    },

    // --- NOVO: CARD DE MEDICAMENTO ---
    cardProduto: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    cardProdutoPromo: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
    },
    imagemProduto: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 12,
    },
    infoProduto: {
        flex: 1,
        justifyContent: 'center',
    },
    nomeProduto: {
        fontSize: 15,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 2,
    },
    marcaProduto: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 4,
    },
    // Estilo específico para a Farmácia no card de listagem
    farmaciaProduto: {
        fontSize: 12,
        color: '#2A7CC7',
        fontWeight: '500',
        marginBottom: 6,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    precoAntigo: {
        fontSize: 11,
        color: '#94a3b8',
        textDecorationLine: 'line-through',
        marginRight: 6,
    },
    precoAtual: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#10B981',
    },
    badgePromo: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#EF4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeTexto: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },

    // --- EMPTY STATE ---
    emptyContainer: {
        marginTop: 50,
        alignItems: 'center'
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16
    }
});