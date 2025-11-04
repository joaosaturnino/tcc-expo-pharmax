import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import api from '../../services/api';

export default function Categoria({ route, navigation }) {
    const { nome, medicamentos = [] , tipo } = route.params;

    // Filtra os medicamentos pela categoria selecionada
    const filtrados = medicamentos.filter(med => med.categoria === nome);

  const [ categoriasSelecionadas, setCategoriasSelecionadas ] = useState([]);
    useEffect(() => {
        fetchCategoriasSelecionadas();
        
    }, [tipo]);
    async function  fetchCategoriasSelecionadas(){
    try {
        const response = await api.get(`/medicamentos/tipo/${tipo}`)
        console.log(tipo);
        
        setCategoriasSelecionadas(response.data.dados);
        } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        }
    }

    const renderMedicamento = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Produto', { produto: item })}
        >
            <Text style={styles.nome}>{item.med_nome}</Text>
            <Text style={styles.marca}>{item.lab_nome}</Text>
            <Text style={styles.preco}>R$ {item.medp_preco}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Categoria: {nome}</Text>
            <FlatList
                data={categoriasSelecionadas}
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