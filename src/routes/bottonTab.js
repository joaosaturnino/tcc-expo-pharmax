import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';

import Home from "./../screens/Home/index";
import Favoritos from "./../screens/Favoritos/index";
import Perfil from "./../screens/Perfil/index"; 
import Produto from '../screens/produto'; // Adicione este import

const Tab = createBottomTabNavigator();

export default function BottomTab() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home-outline';
                    } else if (route.name === 'Favoritos') {
                        iconName = 'heart-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2A7CC7', // Azul do PharmaX
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
            />
            <Tab.Screen
                name="Favoritos"
                component={Favoritos}
                options={{ title: 'Favoritos' }}
            />
            <Tab.Screen
                name="Perfil"
                component={Perfil}
                options={{ title: 'Perfil' }}
            />

            <Tab.Screen
                name="Produto"
                component={Produto}
                options={{
                    tabBarButton: () => null, // não mostra na bottom tab
                    headerShown: false,       // opcional: também remove o header
                }} 
                
            />
        </Tab.Navigator>
    );
}