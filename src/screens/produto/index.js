import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './styles';

export default function Produto() {
  const navigation = useNavigation();
  const route = useRoute();
  const { produto } = route.params || {};

  const [quantidade, setQuantidade] = useState(1);
  const [farmacias, setFarmacias] = useState([]);

  // Dados de exemplo - substitua pela sua API
  useEffect(() => {
    if (produto) {
      // Simulando busca de farmácias que têm o produto
      const farmaciasComProduto = [
        {
          id: '1',
          nome: 'Drogaria São Paulo',
          endereco: 'Rua das Flores, 123 - Centro',
          distancia: '0.8 km',
          preco: produto.preco,
          quantidade: 15,
          telefone: '(11) 1234-5678',
          coordenadas: '-23.5505, -46.6333'
        },
        {
          id: '2',
          nome: 'Drogaria Pacheco',
          endereco: 'Av. Paulista, 1000 - Bela Vista',
          distancia: '1.5 km',
          preco: (parseFloat(produto.preco.replace('R$ ', '').replace(',', '.')) + 1.50).toFixed(2).replace('.', ','),
          quantidade: 8,
          telefone: '(11) 9876-5432',
          coordenadas: '-23.5632, -46.6544'
        },
        {
          id: '3',
          nome: 'Drogaria Raia',
          endereco: 'Rua Augusta, 500 - Consolação',
          distancia: '2.1 km',
          preco: produto.preco,
          quantidade: 3,
          telefone: '(11) 3333-4444',
          coordenadas: '-23.5475, -46.6432'
        }
      ];
      setFarmacias(farmaciasComProduto);
    }
  }, [produto]);

  const aumentarQuantidade = () => {
    setQuantidade(quantidade + 1);
  };

  const diminuirQuantidade = () => {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  };

  const fazerChamada = (telefone) => {
    Linking.openURL(`tel:${telefone}`);
  };

  const abrirMapa = (coordenadas) => {
    const [latitude, longitude] = coordenadas.split(',');
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const renderFarmacia = ({ item }) => (
    <View style={styles.farmaciaCard}>
      <Text style={styles.farmaciaNome}>{item.nome}</Text>
      <Text style={styles.farmaciaEndereco}>{item.endereco}</Text>
      <Text style={styles.farmaciaDistancia}>{item.distancia}</Text>
      
      <View style={styles.farmaciaInfo}>
        <View>
          <Text style={styles.farmaciaPreco}>R$ {item.preco}</Text>
          <Text style={styles.farmaciaQuantidade}>Disponível: {item.quantidade} unidades</Text>
        </View>
        
        <View style={styles.farmaciaAcoes}>
          <TouchableOpacity 
            style={styles.farmaciaBotao}
            onPress={() => abrirMapa(item.coordenadas)}
          >
            <Text style={styles.farmaciaBotaoTexto}>🗺️ Como chegar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.farmaciaBotao}
            onPress={() => fazerChamada(item.telefone)}
          >
            <Text style={styles.farmaciaBotaoTexto}>📞 Ligar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (!produto) {
    return (
      <View style={styles.container}>
        <Text>Produto não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Produto</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Imagem e Informações Básicas */}
        <View style={styles.produtoHeader}>
          <View style={styles.produtoImagemContainer}>
            <Image 
              source={produto.imagem || require('../../../public/alergia.png')} 
              style={styles.produtoImagem}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.produtoInfoBasica}>
            <Text style={styles.produtoNome}>{produto.nome}</Text>
            <Text style={styles.produtoMarca}>{produto.marca}</Text>
            <Text style={styles.produtoCategoria}>{produto.categoria || 'Medicamento'}</Text>
          </View>
        </View>

        {/* Seletor de Quantidade */}
        <View style={styles.quantidadeContainer}>
          <Text style={styles.quantidadeTitulo}>Quantidade:</Text>
          <View style={styles.quantidadeControles}>
            <TouchableOpacity onPress={diminuirQuantidade} style={styles.quantidadeBotao}>
              <Text style={styles.quantidadeBotaoTexto}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantidadeValor}>{quantidade}</Text>
            
            <TouchableOpacity onPress={aumentarQuantidade} style={styles.quantidadeBotao}>
              <Text style={styles.quantidadeBotaoTexto}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Descrição do Produto */}
        <View style={styles.descricaoContainer}>
          <Text style={styles.secaoTitulo}>Descrição</Text>
          <Text style={styles.descricaoTexto}>
            {produto.descricao || 'Este medicamento é utilizado para o tratamento de diversas condições. Consulte sempre um médico antes de usar.'}
          </Text>
        </View>

        {/* Farmácias com o Produto */}
        <View style={styles.farmaciasContainer}>
          <Text style={styles.secaoTitulo}>Disponível nas farmácias:</Text>
          <FlatList
            data={farmacias}
            renderItem={renderFarmacia}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Espaço no final */}
        <View style={styles.espacoFinal} />
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
          <Text style={[styles.tabIcon, styles.tabActive]}>🏠</Text>
          <Text style={[styles.tabText, styles.tabActive]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Favoritos')}>
          <Text style={styles.tabIcon}>❤️</Text>
          <Text style={styles.tabText}>Favoritos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Perfil')}>
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={styles.tabText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}