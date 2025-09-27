import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from './styles';

export default function Farmacia() {
  const route = useRoute();
  const navigation = useNavigation();
  const { nome, medicamentos, imagemFarmacia } = route.params;

  // Filtrar medicamentos por farmácia
  const medicamentosFarmacia = medicamentos.filter(
    medicamento => medicamento.farmacia?.toLowerCase().includes(nome.toLowerCase())
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
      {/* Banner/Perfil da Farmácia */}
      <View style={styles.bannerContainer}>
        <Image
          source={imagemFarmacia || require('../../../public/cimed.png')}
          style={styles.bannerImagem}
          resizeMode="cover"
        />
        <Text style={styles.bannerNome}>{nome}</Text>
      </View>

      {/* Contador de medicamentos */}
      <View style={styles.contadorContainer}>
        <Text style={styles.contadorText}>
          {medicamentosFarmacia.length} medicamento{medicamentosFarmacia.length !== 1 ? 's' : ''} encontrado{medicamentosFarmacia.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Lista de medicamentos */}
      {medicamentosFarmacia.length > 0 ? (
        <FlatList
          data={medicamentosFarmacia}
          renderItem={renderMedicamento}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.medicamentosList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum medicamento encontrado para esta farmácia</Text>
        </View>
      )}
    </View>
  );
}