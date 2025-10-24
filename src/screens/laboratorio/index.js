import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from './styles';

export default function BaseLista() {
  const route = useRoute();
  const navigation = useNavigation();
  const { nome, medicamentos, tipo = 'item', imagemLaboratorio } = route.params;

  // Exemplo de filtro genérico (ajuste conforme o tipo)
  const itensFiltrados = medicamentos.filter(
    item => {
      if (tipo === 'laboratorio') return item.marca?.toLowerCase().includes(nome.toLowerCase());
      if (tipo === 'farmacia') return item.farmacia?.toLowerCase().includes(nome.toLowerCase());
      if (tipo === 'categoria') return item.categoria?.toLowerCase().includes(nome.toLowerCase());
      return true;
    }
  );
  
  

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.medicamentoCard}
      onPress={() => {
        if (tipo === 'laboratorio') {
          navigation.navigate('Laboratorio', { nome: item.nome, medicamentos: produtosPromocao, imagemLaboratorio: item.banner });
        } else {
          navigation.navigate('Produto', { produto: item });
        }
      }}
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
      {/* Banner do Laboratório */}
      <View style={styles.bannerContainer}>
        <Image
          source={imagemLaboratorio || require('../../../public/cimed.png')}
          style={styles.bannerImagem}
          resizeMode="cover"
        />
        <Text style={styles.bannerNome}>{nome}</Text>
      </View>

      <View style={styles.contadorContainer}>
        <Text style={styles.contadorText}>
          {itensFiltrados.length} {tipo}{itensFiltrados.length !== 1 ? 's' : ''} encontrado{itensFiltrados.length !== 1 ? 's' : ''}
        </Text>
      </View>
      {itensFiltrados.length > 0 ? (
        <FlatList
          data={itensFiltrados}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.medicamentosList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum {tipo} encontrado</Text>
        </View>
      )}
    </View>
  );
}