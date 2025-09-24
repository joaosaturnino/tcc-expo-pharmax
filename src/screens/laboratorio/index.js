import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from './styles';

export default function Laboratorio() {
  const route = useRoute();
  const navigation = useNavigation();
  const { nome, medicamentos } = route.params;

  // Filtrar medicamentos por laboratório (marca)
  const medicamentosLaboratorio = medicamentos.filter(
    medicamento => medicamento.marca.toLowerCase().includes(nome.toLowerCase())
  );

  const renderMedicamento = ({ item }) => (
    <TouchableOpacity 
      style={styles.medicamentoCard}
      onPress={() => navigation.navigate('Produto', { produto: item })}
    >
      <View style={styles.medicamentoImagem}>
        <Text style={styles.medicamentoImagemTexto}>💊</Text>
      </View>
      <View style={styles.medicamentoInfo}>
        <Text style={styles.medicamentoNome} numberOfLines={2}>{item.nome}</Text>
        <Text style={styles.medicamentoCategoria}>{item.categoria}</Text>
        <Text style={styles.medicamentoPreco}>{item.preco}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header com nome do laboratório */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{nome}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Contador de medicamentos */}
      <View style={styles.contadorContainer}>
        <Text style={styles.contadorText}>
          {medicamentosLaboratorio.length} medicamento{medicamentosLaboratorio.length !== 1 ? 's' : ''} encontrado{medicamentosLaboratorio.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Lista de medicamentos */}
      {medicamentosLaboratorio.length > 0 ? (
        <FlatList
          data={medicamentosLaboratorio}
          renderItem={renderMedicamento}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.medicamentosList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum medicamento encontrado para este laboratório</Text>
        </View>
      )}
    </View>
  );
}