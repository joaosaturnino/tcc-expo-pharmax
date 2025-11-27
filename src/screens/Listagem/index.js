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
// Verifique se este IP é exatamente o da sua máquina
const SERVER_IP = '172.16.0.34:3334';
const BASE_URL = `http://${SERVER_IP}`;

// --- HELPER: URL IMAGEM (CORRIGIDO) ---
const getImageUrl = (caminho, tipo) => {
    // 1. Imagem Padrão se não houver caminho
    if (!caminho) {
        if (tipo === 'medicamento') return { uri: `${BASE_URL}/public/medicamentos/caixa-medicamento-padrao5.png` };
        const pasta = tipo === 'farmacia' ? 'farmacias' : 'laboratorios';
        return { uri: `${BASE_URL}/public/${pasta}/padrao.png` }; // Ajustei para padrao.png que costuma existir
    }

    // 2. CORREÇÃO CRÍTICA: Remove o ponto extra antes do IP (http://.172 -> http://172)
    let urlLimpa = caminho;
    if (typeof caminho === 'string') {
        urlLimpa = caminho.replace('http://.', 'http://').replace('https://.', 'https://');
    }

    // 3. Se já for uma URL completa (http...), retorna ela limpa
    if (typeof urlLimpa === 'string' && urlLimpa.startsWith('http')) {
        return { uri: urlLimpa };
    }

    // 4. Se for apenas o nome do arquivo, monta a URL completa
    if (typeof urlLimpa === 'string') {
        const cleanPath = urlLimpa.startsWith('/') ? urlLimpa.substring(1) : urlLimpa;
        
        // Se for farmácia, e o caminho for só "logo.png", precisamos apontar para a pasta certa
        if (tipo === 'farmacia' && !cleanPath.includes('/')) {
             return { uri: `${BASE_URL}/public/logos/${cleanPath}` };
        }

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
                // Verifique se sua API usa /todoslab ou /laboratorios
                url = "/laboratorios?qtde=50"; 
            } else if (tipo === 'medicamento') {
                url = "/medicamentos/todos?limit=50"; 
            }

            if (!url) return;

            console.log(`Buscando dados de: ${url}`); // Debug
            const response = await api.get(url);
            
            // Tratamento flexível para o retorno
            const lista = response.data.dados || response.data || [];
            
            // Se vier vazio, loga para ajudar no debug
            if (lista.length === 0) console.log("API retornou lista vazia.");
            
            setDados(lista);

        } catch (error) {
            console.error('Erro ao buscar listagem:', error);
            if (error.response) {
                 console.log('Status erro:', error.response.status);
            }
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
        // Tenta pegar de qualquer campo possível
        const rawUrl = item.farm_logo_url || item.farm_logo || item.logo;
        const imageSource = getImageUrl(rawUrl, 'farmacia');
        
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Farmacia', {
                    farm_id: item.farm_id,
                    nome: item.farm_nome,
                    imagemFarmacia: imageSource.uri // Passa a URL já tratada
                })}
            >
                <Image 
                    source={imageSource} 
                    style={styles.imagem} // Estilo retangular
                    resizeMode="contain" 
                />
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
                    imagemLaboratorio: imageSource.uri
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

    // --- RENDER: MEDICAMENTO ---
    const renderMedicamento = ({ item }) => {
        const promo = calcularPrecoPromocional(item);
        const source = getImageUrl(item.med_imagem || item.imagem, 'medicamento');
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
    // --- ALTERAÇÃO AQUI: Formato Retangular para Logo ---
    imagem: {
        width: 80,            // Mais largo
        height: 60,           // Menos alto
        borderRadius: 8,      // Cantos levemente arredondados
        backgroundColor: '#fff', 
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9'
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

    // --- CARD DE MEDICAMENTO ---
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