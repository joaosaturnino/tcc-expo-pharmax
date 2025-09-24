import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function Laboratorio({ route, navigation }) {
    const { nome, medicamentos = [] } = route.params;

    // Filtra os medicamentos pelo laboratório selecionado
    const filtrados = medicamentos.filter(med => med.marca === nome);

    const renderMedicamento = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Produto', { produto: item })}
        >
            <View style={styles.imgContainer}>
                <Image
                    source={require('../../../public/alergia.png')}
                    style={styles.img}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.info}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.preco}>{item.preco}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Medicamentos do laboratório:</Text>
            <Text style={styles.labName}>{nome}</Text>
            <FlatList
                data={filtrados}
                renderItem={renderMedicamento}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum medicamento deste laboratório.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    title: { fontSize: 20, fontWeight: 'bold', marginTop: 24, marginHorizontal: 16, color: '#2A7CC7' },
    labName: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, marginHorizontal: 16, color: '#333' },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    imgContainer: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#eaf1fa',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    img: {
        width: 38,
        height: 38,
    },
    info: {
        flex: 1,
    },
    nome: { fontSize: 17, fontWeight: 'bold', color: '#222' },
    preco: { fontSize: 16, color: '#2A7CC7', marginTop: 4 },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
});