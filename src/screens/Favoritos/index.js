import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';

import styles from './styles';

export default function Favoritos() {
    // Dados de exemplo - substitua pelos seus produtos reais
    const [favoritos, setFavoritos] = useState([
        {
            id: 1,
            nome: 'Paracetamol 500mg',
            preco: 'R$ 12,90',
            laboratorio: 'Medley',
            imagem: require('../../../public/logo.png') // Use sua imagem real
        },
        {
            id: 2,
            nome: 'Dipirona 500mg',
            preco: 'R$ 8,50',
            laboratorio: 'Neo Química',
            imagem: require('../../../public/logo.png') // Use sua imagem real
        },
        {
            id: 3,
            nome: 'Omeprazol 20mg',
            preco: 'R$ 15,75',
            laboratorio: 'EMS',
            imagem: require('../../../public/logo.png') // Use sua imagem real
        }
    ]);

    const removerFavorito = (id, nome) => {
        setFavoritos(favoritos.filter(item => item.id !== id));
        Alert.alert('Removido', `${nome} foi removido dos favoritos`);
    };

    if (favoritos.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Meus Favoritos</Text>
                </View>

                <View style={styles.vazioContainer}>
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
            <View style={styles.header}>
                <Text style={styles.title}>Meus Favoritos</Text>
                <Text style={styles.subtitle}>{favoritos.length} produto(s) salvo(s)</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {favoritos.map((produto) => (
                    <View key={produto.id} style={styles.produtoCard}>
                        <Image
                            source={produto.imagem}
                            style={styles.produtoImagem}
                            resizeMode="contain"
                        />

                        <View style={styles.produtoInfo}>
                            <Text style={styles.produtoNome}>{produto.nome}</Text>
                            <Text style={styles.produtoLaboratorio}>{produto.laboratorio}</Text>
                            <Text style={styles.produtoPreco}>{produto.preco}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.removerButton}
                            onPress={() => removerFavorito(produto.id, produto.nome)}
                        >
                            <Text style={styles.removerButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}