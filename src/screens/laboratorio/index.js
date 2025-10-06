import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

export default function Laboratorio() {
  const route = useRoute();
  const navigation = useNavigation();
  const { nome, medicamentos, imagemLaboratorio } = route.params;

  // Medicamentos disponíveis
  const medicamentosLaboratorio = medicamentos || [];

  // Banner específico para cada laboratório
  const getBannerLaboratorio = (laboratorioNome) => {
    const banners = {
      'Cimed': require('../../../public/cimed.png'),
      'EuroPharma': require('../../../public/europharma.png'),
      'Ems': require('../../../public/ems.png'),
      'Medley': require('../../../public/medley.png'),
    };
    return banners[laboratorioNome] || require('../../../public/cimed.png');
  };

  const renderMedicamento = ({ item }) => (
    <TouchableOpacity 
      style={styles.medicamentoCard}
      onPress={() => navigation.navigate('Produto', { produto: item })}
    >
      <View style={styles.medicamentoImagem}>
        {item.imagem ? (
          <Image 
            source={item.imagem} 
            style={styles.medicamentoImagemReal}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.medicamentoImagemTexto}>💊</Text>
        )}
      </View>
      <View style={styles.medicamentoInfo}>
        <Text style={styles.medicamentoNome} numberOfLines={2}>{item.nome}</Text>
        <Text style={styles.medicamentoCategoria}>{item.marca} • {item.categoria}</Text>
        <Text style={styles.medicamentoPreco}>{item.preco}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Grande Atrás do Perfil */}
        <View style={styles.bannerGrandeContainer}>
          <Image
            source={getBannerLaboratorio(nome)}
            style={styles.bannerGrandeImagem}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay} />
          
          {/* Container do Perfil sobre o Banner */}
          <View style={styles.perfilContainer}>
            <View style={styles.perfilImagemWrapper}>
              <Image
                source={imagemLaboratorio}
                style={styles.perfilImagem}
                resizeMode="contain"
              />
            </View>
          </View>
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
            scrollEnabled={false}
            contentContainerStyle={styles.medicamentosList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.medicamentoImagemTexto}>💊</Text>
            <Text style={styles.emptyText}>Nenhum medicamento encontrado para este laboratório</Text>
          </View>
        )}
        
        {/* Espaço final */}
        <View style={styles.espacoFinal} />
      </ScrollView>
    </View>
  );
}