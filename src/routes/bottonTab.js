import React, { useCallback } from 'react'; // Removi useState e axios daqui
import { BackHandler, Platform, View, Text } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Importe o Hook do Contexto
import { useReserva } from '../contexts/ReservaContext';

// ... (Mantenha seus imports de telas: Home, Favoritos, etc) ...
import Home from "../screens/Home";
import Favoritos from "../screens/Favoritos";
import Perfil from "../screens/Perfil";
import MeusPedidos from "../screens/Reservas/MeusPedidos";
import Comunidade from "../screens/Comunidade"; 
import Produto from '../screens/produto';
import Farmacia from '../screens/farmacia';
import Laboratorio from '../screens/laboratorio';
import Categoria from '../screens/Categoria';
import Pesquisa from '../screens/Pesquisa';
import Listagem from '../screens/Listagem';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack({ route }) {
    const { userId } = route.params || {};
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeInitial" component={Home} initialParams={{ userId }} />
            <Stack.Screen name="Produto" component={Produto} options={{ headerShown: true, title: 'Detalhes' }} />
            <Stack.Screen name="Farmacia" component={Farmacia} options={{ headerShown: true, title: 'Farmácia' }} />
            <Stack.Screen name="Laboratorio" component={Laboratorio} options={{ headerShown: true, title: 'Laboratório' }} />
            <Stack.Screen name="Categoria" component={Categoria} options={{ headerShown: true, title: 'Categoria' }} />
            <Stack.Screen name="Pesquisa" component={Pesquisa} options={{ headerShown: false }} />
            <Stack.Screen name="Listagem" component={Listagem} options={{ headerShown: true, title: 'Lista' }} />
        </Stack.Navigator>
    );
}

export default function BottomTab({ route }) {
    const { userId } = route.params || {};

    // USANDO O CONTEXTO AQUI
    const { qtdReservas, atualizarBadge } = useReserva();

    useFocusEffect(
        useCallback(() => {
            // Quando a tab ganha foco, pedimos para atualizar o número
            if (userId) {
                atualizarBadge(userId);
            }

            const onBackPress = () => false;
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [userId]) // Removemos atualizarBadge das dependências para evitar loop
    );

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#458B00',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: '#FFFFFF',
                    height: Platform.OS === 'android' ? 60 : 80,
                    paddingBottom: Platform.OS === 'android' ? 8 : 25,
                    borderTopWidth: 0,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarLabelStyle: { fontSize: 10, fontWeight: '500', marginTop: -5 }
            }}
        >
            <Tab.Screen
                name="HomeStack"
                component={HomeStack}
                initialParams={{ userId }}
                options={{
                    title: 'Início',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
                    ),
                }}
            />
            
            <Tab.Screen
                name="Favoritos"
                component={Favoritos}
                initialParams={{ userId }}
                options={{
                    title: 'Favoritos',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="MeusPedidos"
                component={MeusPedidos}
                initialParams={{ userId }}
                options={{
                    title: 'Compras',
                    tabBarLabel: () => null,
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            width: 56, height: 56,
                            backgroundColor: '#458B00',
                            borderRadius: 28,
                            justifyContent: 'center', alignItems: 'center',
                            marginBottom: Platform.OS === "android" ? 25 : 15,
                            shadowColor: "#458B00", shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.4, shadowRadius: 5, elevation: 8,
                            borderWidth: 3, borderColor: '#f8fafc',
                            position: 'relative'
                        }}>
                            <Ionicons name="bag-handle" size={28} color="white" />

                            {/* Usa a variável do Contexto */}
                            {qtdReservas > 0 && (
                                <View style={{
                                    position: 'absolute', top: -2, right: -2,
                                    backgroundColor: '#EF4444', borderRadius: 10,
                                    minWidth: 20, height: 20,
                                    justifyContent: 'center', alignItems: 'center',
                                    borderWidth: 1.5, borderColor: '#FFFFFF'
                                }}>
                                    <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 4 }}>
                                        {qtdReservas}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Comunidade"
                component={Comunidade}
                initialParams={{ userId }}
                options={{
                    title: 'Comunidade',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'people' : 'people-outline'} size={26} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="Perfil"
                component={Perfil}
                initialParams={{ userId }}
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}