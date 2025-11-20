import React, { useCallback } from 'react';
import { BackHandler, Alert } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// --- IMPORTS DAS TELAS ---
// OBSERVAÇÃO IMPORTANTE:
// O erro "Element type is invalid" acontece se estes caminhos estiverem errados.
// O React Native procura automaticamente por um 'index.js' dentro da pasta.
// Se o seu arquivo se chama 'Home.js' (e não index.js), mude para: '../screens/Home/Home'
import Home from "../screens/Home";
import Favoritos from "../screens/Favoritos";
import Perfil from "../screens/Perfil";

const Tab = createBottomTabNavigator();

export default function BottomTab({ route }) {

    // 1. RECUPERAÇÃO DE DADOS (SAFE MODE)
    // Usamos "|| {}" para evitar que o App feche se 'route.params' vier vazio (undefined).
    // Isso pega o ID do usuário que logou para passar para as próximas telas.
    const { userId } = route.params || {};

    // 2. CONTROLE DO BOTÃO VOLTAR (HARDWARE BACK BUTTON - ANDROID)
    // O useFocusEffect garante que esse código só rode quando a aba estiver VISÍVEL/FOCADA.
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                // Cria o alerta perguntando se o usuário quer sair
                Alert.alert(
                    "Sair",
                    "Deseja sair do aplicativo?",
                    [
                        { text: "Não", style: "cancel", onPress: () => { } }, // Não faz nada
                        {
                            text: "Sim",
                            style: "destructive",
                            onPress: () => BackHandler.exitApp() // Fecha o App totalmente
                        }
                    ]
                );

                // RETORNAR TRUE É O SEGREDO:
                // Diz ao sistema Android: "Eu já cuidei do clique, não faça a ação padrão (voltar)".
                return true;
            };

            // Adiciona o "escutador" do evento
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            // 3. LIMPEZA DE MEMÓRIA (CLEANUP)
            // Essa função roda automaticamente quando saímos da tela.
            return () => {
                // Verifica se o método 'remove' existe (versões novas do React Native)
                if (subscription && subscription.remove) {
                    subscription.remove();
                } else {
                    // Método antigo para versões anteriores (Fallback)
                    BackHandler.removeEventListener('hardwareBackPress', onBackPress);
                }
            };
        }, [])
    );

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                // 4. ÍCONES DINÂMICOS
                // Muda o ícone (cheio ou contorno) dependendo se a aba está ativa (focused)
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Favoritos') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                // 5. ESTILIZAÇÃO DA BARRA
                tabBarActiveTintColor: '#A2CD5A', // Cor verde (Ativo)
                tabBarInactiveTintColor: '#888',  // Cor cinza (Inativo)
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderTopColor: '#ddd',
                    height: 60,
                    paddingBottom: 5,
                },
                headerShown: false, // Remove o cabeçalho padrão (Header)
            })}
        >
            {/* 6. PASSAGEM DE PARÂMETROS (PROP DRILLING)
               O 'initialParams' injeta o 'userId' dentro de cada tela.
               Lá na Home, você acessa usando: const { userId } = route.params;
            */}
            <Tab.Screen
                name="Home"
                component={Home}
                options={{ title: 'Início' }}
                initialParams={{ userId: userId }}
            />
            <Tab.Screen
                name="Favoritos"
                component={Favoritos}
                options={{ title: 'Favoritos' }}
                initialParams={{ userId: userId }}
            />
            <Tab.Screen
                name="Perfil"
                component={Perfil}
                options={{ title: 'Meu Perfil' }}
                initialParams={{ userId: userId }}
            />
        </Tab.Navigator>
    );
}