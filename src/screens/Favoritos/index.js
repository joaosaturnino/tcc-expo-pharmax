import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';

export default function Favoritos() {
    const navigation = useNavigation();

    // Dados de exemplo - substitua pelos seus produtos reais
    const [favoritos, setFavoritos] = useState([
        {
            id: '1',
            nome: 'Paracetamol 500mg',
            preco: 'R$ 12,90',
            marca: 'Medley',
            imagem: require('../../../public/logo.png')
        },
        {
            id: '2',
            nome: 'Dipirona 500mg',
            preco: 'R$ 8,50',
            marca: 'Neo Química',
            imagem: require('../../../public/logo.png')
        },
        {
            id: '3',
            nome: 'Omeprazol 20mg',
            preco: 'R$ 15,75',
            marca: 'EMS',
            imagem: require('../../../public/logo.png')
        },
        {
            id: '4',
            nome: 'Ibuprofeno 400mg',
            preco: 'R$ 14,90',
            marca: 'Eurofarma',
            imagem: require('../../../public/logo.png')
        },
        {
            id: '5',
            nome: 'Loratadina 10mg',
            preco: 'R$ 9,90',
            marca: 'Aché',
            imagem: require('../../../public/logo.png')
        }
    ]);

    const removerFavorito = (id, nome) => {
        setFavoritos(favoritos.filter(item => item.id !== id));
        Alert.alert('Removido', `${nome} foi removido dos favoritos`);
    };

    const renderProduto = ({ item }) => (
        <View style={styles.produtoCard}>
            <View style={styles.produtoImagem}>
                <Image
                    source={item.imagem}
                    style={styles.produtoImagem}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.produtoInfo}>
                <Text style={styles.produtoNome} numberOfLines={2}>{item.nome}</Text>
                <Text style={styles.produtoMarca}>{item.marca}</Text>
                <Text style={styles.produtoPreco}>{item.preco}</Text>
            </View>

            <TouchableOpacity
                style={styles.removerButton}
                onPress={() => removerFavorito(item.id, item.nome)}
            >
                <Text style={styles.removerIcon}>✕</Text>
            </TouchableOpacity>
        </View>
    );

    if (favoritos.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Meus Favoritos</Text>
                </View>

                <View style={styles.vazioContainer}>
                    <Text style={styles.vazioIcon}>❤️</Text>
                    <Text style={styles.vazioTexto}>Nenhum produto favoritado</Text>
                    <Text style={styles.vazioSubtexto}>
                        Os produtos que você favoritar aparecerão aqui
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Meus Favoritos</Text>
                <Text style={styles.subtitle}>{favoritos.length} produto(s) salvo(s)</Text>
            </View>

            <FlatList
                data={favoritos}
                renderItem={renderProduto}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listaContainer}
                ListFooterComponent={<View style={styles.espacoFinal} />}
            />
        </View>
    );
}