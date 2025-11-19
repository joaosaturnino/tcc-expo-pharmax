import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';

import Home from "./../screens/Home/index";
import Favoritos from "./../screens/Favoritos/index";
import Perfil from "./../screens/Perfil/index";

const Tab = createBottomTabNavigator();

// 1. A função agora recebe { route } como uma propriedade (prop)
export default function BottomTab({ route }) {

    // 2. Extrai o userId dos parâmetros que vieram da tela de Login.
    // O '|| {}' é uma segurança para evitar que o app quebre se não houver parâmetros.
    const { userId } = route.params || {};

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size, focused }) => { // 'focused' pode ser usado para ícones diferentes
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
                tabBarActiveTintColor: '#A2CD5A',
                tabBarInactiveTintColor: '#888',
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderTopColor: '#ddd',
                    paddingVertical: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 5,
                },
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{ title: 'Home' }}
                // 3. Passa o userId para a tela Home
                initialParams={{ userId: userId }}
            />
            <Tab.Screen
                name="Favoritos"
                component={Favoritos}
                options={{ title: 'Favoritos' }}
                // 3. Passa o userId para a tela Favoritos
                initialParams={{ userId: userId }}
            />
            <Tab.Screen
                name="Perfil"
                component={Perfil}
                options={{ title: 'Perfil' }}
                // 3. Passa o userId para a tela Perfil
                initialParams={{ userId: userId }}
            />
        </Tab.Navigator>
    );
}