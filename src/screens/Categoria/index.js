import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export default function Categoria({ route, navigation }) {
    const { nome, medicamentos = [] } = route.params;

    // Filtra os medicamentos pela categoria selecionada
    const filtrados = medicamentos.filter(med => med.categoria === nome);

    const renderMedicamento = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Produto', { produto: item })}
        >
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.marca}>{item.marca}</Text>
            <Text style={styles.preco}>R$ {item.preco}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Categoria: {nome}</Text>
            <FlatList
                data={filtrados}
                renderItem={renderMedicamento}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={<Text>Nenhum medicamento nesta categoria.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', margin: 16 },
    card: { backgroundColor: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 12 },
    nome: { fontSize: 18, fontWeight: 'bold' },
    marca: { fontSize: 14, color: '#555' },
    preco: { fontSize: 16, color: '#2A7CC7', marginTop: 4 },
});