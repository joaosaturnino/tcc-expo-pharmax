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

// --- CONFIGURAÇÃO GLOBAL DA URL DE IMAGENS ---
// Alterar aqui facilita a manutenção quando o IP muda.
const SERVER_IP = '192.168.200.27:3334';
const BASE_URL = `http://${SERVER_IP}`;

// Função auxiliar para tratar URLs de imagem (relativas ou absolutas)
const getImageUrl = (caminho, tipo) => {
    // 1. Se não vier caminho, devolve a imagem padrão baseada no tipo
    if (!caminho) {
        const pasta = tipo === 'farmacia' ? 'farmacias' : 'laboratorios';
        return { uri: `${BASE_URL}/public/${pasta}/logo.png` };
    }

    // 2. Se já for um link completo (começa com http), usa ele mesmo
    if (typeof caminho === 'string' && caminho.startsWith('http')) {
        return { uri: caminho };
    }

    // 3. Se for caminho relativo (ex: /uploads/foto.png), adiciona o servidor antes
    if (typeof caminho === 'string') {
        const cleanPath = caminho.startsWith('/') ? caminho.substring(1) : caminho;
        return { uri: `${BASE_URL}/${cleanPath}` };
    }

    return { uri: `${BASE_URL}/public/${tipo === 'farmacia' ? 'farmacias' : 'laboratorios'}/padrao.png` };
};

export default function Listagem() {
    const navigation = useNavigation();
    const route = useRoute();

    // Recebe os parâmetros enviados pela tela Home (tipo = 'farmacia' ou 'laboratorio')
    const { tipo, titulo } = route.params || {};

    // --- ESTADOS ---
    const [dados, setDados] = useState([]);          // Armazena a lista vinda da API
    const [loading, setLoading] = useState(true);    // Controla o carregamento inicial (tela cheia)
    const [refreshing, setRefreshing] = useState(false); // Controla o "puxar para atualizar"

    // Configura o título do cabeçalho dinamicamente
    useLayoutEffect(() => {
        navigation.setOptions({
            title: titulo || 'Listagem',
            headerBackTitleVisible: false, // Esconde o texto "Voltar" no iOS
        });
    }, [navigation, titulo]);

    // --- FUNÇÃO DE BUSCA (Reutilizável) ---
    const buscarDados = async () => {
        try {
            let url = '';
            // Define qual rota da API chamar baseada no tipo
            if (tipo === 'farmacia') {
                url = '/farmacias'; // Rota que retorna todas as farmácias
            } else if (tipo === 'laboratorio') {
                url = "/todoslab"; // Ajustado: Geralmente padroniza-se como /laboratorios, mas se sua API for /todoslab, mantenha.
            }

            if (!url) return;

            const response = await api.get(url);

            // Tratamento para garantir que pegamos o array correto, independente do formato da resposta
            // (Ex: response.data.dados ou response.data direto)
            const lista = response.data.dados || response.data || [];
            setDados(lista);

        } catch (error) {
            console.error('Erro ao buscar listagem:', error);
            // Dica: Aqui poderia adicionar um Alert.alert('Erro', 'Falha ao carregar')
        }
    };

    // 1. Carregamento Inicial: Roda apenas uma vez quando a tela abre (ou se o 'tipo' mudar)
    useEffect(() => {
        setLoading(true);
        buscarDados().finally(() => setLoading(false));
    }, [tipo]);

    // 2. Pull-to-Refresh: Função chamada pelo RefreshControl
    const onRefresh = useCallback(async () => {
        setRefreshing(true);   // Ativa o spinner superior
        await buscarDados();   // Aguarda a busca
        setRefreshing(false);  // Desativa o spinner
    }, [tipo]);

    // --- RENDERIZADORES DE ITEM (Cards) ---

    const renderFarmacia = ({ item }) => {
        // Usa a função auxiliar para garantir que a imagem carregue
        const imageSource = getImageUrl(item.farm_logo_url, 'farmacia');

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Farmacia', {
                    farm_id: item.farm_id,
                    nome: item.farm_nome,
                    imagemFarmacia: item.farm_logo_url // Passa a URL original
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

    const renderLaboratorio = ({ item }) => {
        const nomeLab = item.lab_nome || item.nome;
        // Verifica várias propriedades possíveis para a logo
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

    // --- RENDERIZAÇÃO DA TELA ---

    // Se estiver carregando pela primeira vez, mostra o loader centralizado
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
                // Decide qual função usar para desenhar o card baseada no tipo
                renderItem={tipo === 'farmacia' ? renderFarmacia : renderLaboratorio}

                // KeyExtractor: Garante performance dizendo ao React qual ID é único
                keyExtractor={item => String(item.farm_id || item.lab_id || item.id || Math.random())}

                contentContainerStyle={styles.listContent}

                // Componente para quando a lista volta vazia da API
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum item encontrado.</Text>
                    </View>
                }

                // Configuração do Puxar para Atualizar
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#2A7CC7']} // Cor do spinner no Android
                        tintColor="#2A7CC7"  // Cor do spinner no iOS
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
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        // Sombra suave (iOS e Android)
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
        borderRadius: 25, // Deixa redonda
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