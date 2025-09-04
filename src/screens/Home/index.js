import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

const HomeScreen = () => {
  const [searchText, setSearchText] = useState('');

  // Dados de exemplo - use imagens reais ou ícones temporários
  const featuredMedicines = [
    {
      id: '1',
      name: 'Paracetamol',
      description: 'Analgésico e antitérmico',
      price: 'R$ 12,90',
      image: { uri: 'https://via.placeholder.com/80' },
    },
    {
      id: '2',
      name: 'Omeprazol',
      description: 'Protetor gástrico',
      price: 'R$ 15,50',
      image: { uri: 'https://via.placeholder.com/80' },
    },
    {
      id: '3',
      name: 'Dipirona',
      description: 'Analgésico e antitérmico',
      price: 'R$ 8,90',
      image: { uri: 'https://via.placeholder.com/80' },
    },
  ];

  const features = [
    {
      id: '1',
      icon: 'rocket-outline',
      title: 'Entrega Rápida',
      description: 'Entregamos em até 2 horas',
    },
    {
      id: '2',
      icon: 'medical-outline',
      title: 'Medicamentos Originais',
      description: 'Garantia de qualidade',
    },
    {
      id: '3',
      icon: 'pricetag-outline',
      title: 'Preços Competitivos',
      description: 'Melhores preços',
    },
  ];

  const renderMedicineItem = ({ item }) => (
    <View style={styles.medicineCard}>
      <Image source={item.image} style={styles.medicineImage} />
      <Text style={styles.medicineName}>{item.name}</Text>
      <Text style={styles.medicineDescription}>{item.description}</Text>
      <Text style={styles.medicinePrice}>{item.price}</Text>
    </View>
  );

  const renderFeatureItem = ({ item }) => (
    <View style={styles.featureCard}>
      <Ionicons name={item.icon} size={32} color="#3B82F6" style={styles.featureIcon} />
      <Text style={styles.featureTitle}>{item.title}</Text>
      <Text style={styles.featureDescription}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pharmax</Text>
          <Text style={styles.headerSubtitle}>Sua farmácia digital de confiança</Text>
        </View>

        {/* Campo de Busca */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar medicamentos..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Seção de Destaques */}
        <Text style={styles.sectionTitle}>Por que escolher a Pharmax?</Text>
        <FlatList
          data={features}
          renderItem={renderFeatureItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuresList}
        />

        {/* Medicamentos em Destaque */}
        <Text style={styles.sectionTitle}>Medicamentos em Destaque</Text>
        <FlatList
          data={featuredMedicines}
          renderItem={renderMedicineItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.medicinesList}
        />

        {/* Banner de Promoção */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoTitle}>Entrega Grátis</Text>
          <Text style={styles.promoText}>Em compras acima de R$ 50,00</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;