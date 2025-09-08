import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

const PerfilScreen = () => {
  // Dados do usuário (pode vir de uma API ou contexto no futuro)
  const userData = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    photo: require('../../../public/diplomajpg'), // Use sua imagem de perfil
    membership: 'Plano Premium',
    since: '2023'
  };

  // Opções do menu
  const menuOptions = [
    { id: '1', icon: 'person-outline', title: 'Editar Perfil', screen: 'EditProfile' },
    { id: '2', icon: 'lock-closed-outline', title: 'Alterar Senha', screen: 'ChangePassword' },
    { id: '3', icon: 'document-text-outline', title: 'Meus Pedidos', screen: 'MyOrders' },
    { id: '4', icon: 'heart-outline', title: 'Favoritos', screen: 'Favorites' },
    { id: '5', icon: 'location-outline', title: 'Endereços', screen: 'Addresses' },
    { id: '6', icon: 'card-outline', title: 'Pagamentos', screen: 'Payments' },
    { id: '7', icon: 'notifications-outline', title: 'Notificações', screen: 'Notifications' },
    { id: '8', icon: 'help-circle-outline', title: 'Ajuda', screen: 'Help' },
    { id: '9', icon: 'log-out-outline', title: 'Sair', screen: 'Logout', color: '#FF3B30' },
  ];

  const MenuItem = ({ icon, title, color = '#000', onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={22} color={color} />
        <Text style={[styles.menuItemText, { color }]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
        </View>

        {/* Informações do usuário */}
        <View style={styles.profileSection}>
          <Image source={userData.photo} style={styles.profileImage} />
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          
          <View style={styles.membershipBadge}>
            <Ionicons name="diamond-outline" size={16} color="#3B82F6" />
            <Text style={styles.membershipText}>{userData.membership}</Text>
          </View>
          
          <Text style={styles.memberSince}>Membro desde {userData.since}</Text>
        </View>

        {/* Menu de opções */}
        <View style={styles.menuSection}>
          {menuOptions.map((item) => (
            <MenuItem
              key={item.id}
              icon={item.icon}
              title={item.title}
              color={item.color}
              onPress={() => console.log(`Navegar para: ${item.screen}`)}
            />
          ))}
        </View>

        {/* Versão do app */}
        <Text style={styles.versionText}>Versão 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PerfilScreen;