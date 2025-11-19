import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    Image, 
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../services/api';

export default function Listagem() {
    const navigation = useNavigation();
    const route = useRoute();
    
    // Recebe o tipo ('farmacia' ou 'laboratorio') e o título da tela
    const { tipo, titulo } = route.params;

    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: titulo || 'Listagem',
            headerBackTitleVisible: false,
        });
    }, [navigation, titulo]);

    useEffect(() => {
        async function fetchDados() {
            setLoading(true);
            try {
                let url = '';
                if (tipo === 'farmacia') {
                    url = '/farmacias'; // Busca todas as farmácias
                } else if (tipo === 'laboratorio') {
                    url = "/todoslab"; // Busca todos os laboratórios
                }

                const response = await api.get(url);
                
                // A API pode retornar os dados direto ou dentro de 'dados'
                const lista = response.data.dados || response.data || [];
                setDados(lista);

            } catch (error) {
                console.error('Erro ao buscar listagem:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchDados();
    }, [tipo]);

    // --- RENDERIZADORES ---

    const renderFarmacia = ({ item }) => {
        const img = item.farm_logo_url || 'http://192.168.200.27:3334/public/farmacias/padrao.png';
        
        return (
            <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('Farmacia', { 
                    farm_id: item.farm_id, 
                    nome: item.farm_nome, 
                    imagemFarmacia: item.farm_logo_url 
                })}
            >
                <Image source={{ uri: img }} style={styles.imagem} resizeMode="contain" />
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
        const img = item.lab_logo_url || item.lab_logo || 'http://192.168.200.27:3334/public/laboratorios/padrao.png';

        return (
            <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('Laboratorio', { 
                    lab_id: item.lab_id, 
                    nome: nomeLab, 
                    imagemLaboratorio: img 
                })}
            >
                <Image source={{ uri: img }} style={styles.imagem} resizeMode="contain" />
                <View style={styles.info}>
                    <Text style={styles.nome}>{nomeLab}</Text>
                    <Text style={styles.subtitulo}>Ver catálogo completo</Text>
                </View>
                <Text style={styles.seta}>›</Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2A7CC7" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={dados}
                renderItem={tipo === 'farmacia' ? renderFarmacia : renderLaboratorio}
                keyExtractor={item => String(item.farm_id || item.lab_id || item.id)}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhum item encontrado.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F4F7' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 16 },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
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
    info: { flex: 1 },
    nome: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
    subtitulo: { fontSize: 13, color: '#7f8c8d', marginTop: 2 },
    seta: { fontSize: 24, color: '#ccc', fontWeight: '300' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
});