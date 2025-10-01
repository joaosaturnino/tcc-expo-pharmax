import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

export default function Farmacia() {
  const route = useRoute();
  const navigation = useNavigation();
  const { nome, medicamentos, imagemFarmacia } = route.params;

  // Medicamentos disponíveis
  const medicamentosFarmacia = medicamentos || [];
  const [isFavorito, setIsFavorito] = useState(false);

  // Banner específico para cada farmácia
  const getBannerFarmacia = (farmaciaNome) => {
    const banners = {
      'Drogasil': require('../../../public/drogasil.png'),
      'Pague Menos': require('../../../public/paguemenos.png'),
      'Drogaria São Paulo': require('../../../public/drogariasaopaulo.png'),
    };
    return banners[farmaciaNome] || require('../../../public/cimed.png');
  };

  // Número de favoritos (exemplo)
  const favoritosCount = 1250;

  useEffect(() => {
    const verificarFavorito = async () => {
      const farmaciasFavoritas = await AsyncStorage.getItem('farmaciasFavoritas');
      if (farmaciasFavoritas) {
        const lista = JSON.parse(farmaciasFavoritas);
        setIsFavorito(lista.some(item => item.nome === nome));
      }
    };
    verificarFavorito();
  }, [nome]);

  const toggleFavorito = async () => {
    const farmaciasFavoritas = await AsyncStorage.getItem('farmaciasFavoritas');
    let lista = farmaciasFavoritas ? JSON.parse(farmaciasFavoritas) : [];
    
    if (isFavorito) {
      // Remover dos favoritos
      lista = lista.filter(item => item.nome !== nome);
    } else {
      // Adicionar aos favoritos
      lista.push({ nome, imagem: imagemFarmacia });
    }
    
    await AsyncStorage.setItem('farmaciasFavoritas', JSON.stringify(lista));
    setIsFavorito(!isFavorito);
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
      {/* BOTÃO + REMOVIDO */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Grande Atrás do Perfil */}
        <View style={styles.bannerGrandeContainer}>
          <Image
            source={getBannerFarmacia(nome)}
            style={styles.bannerGrandeImagem}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay} />
          
          {/* Botão Favoritar no canto superior direito */}
          <TouchableOpacity 
            style={styles.favoritarButton}
            onPress={toggleFavorito}
          >
            <Text style={styles.favoritarIcon}>
              {isFavorito ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
          
          {/* Container do Perfil sobre o Banner */}
          <View style={styles.perfilContainer}>
            <View style={styles.perfilImagemWrapper}>
              <Image
                source={imagemFarmacia}
                style={styles.perfilImagem}
                resizeMode="contain"
              />
            </View>
            
            {/* Número de favoritos */}
            <View style={styles.favoritosContainer}>
              <Ionicons name="heart" size={16} color="#FF6B6B" />
              <Text style={styles.favoritosText}>{favoritosCount.toLocaleString()} favoritos</Text>
            </View>
          </View>
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
            scrollEnabled={false}
            contentContainerStyle={styles.medicamentosList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.medicamentoImagemTexto}>💊</Text>
            <Text style={styles.emptyText}>Nenhum medicamento encontrado para esta farmácia</Text>
          </View>
        )}
        
        {/* Espaço final */}
        <View style={styles.espacoFinal} />
      </ScrollView>
    </View>
  );
}