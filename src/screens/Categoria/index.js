import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Categoria({ route }) {
    const { nome } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Categoria: {nome}</Text>
            {/* Adicione aqui o conteúdo da categoria */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold' },
});