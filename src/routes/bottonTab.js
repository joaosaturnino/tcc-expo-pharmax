import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';

import Home from "../screens/Home";
import Favoritos from "../screens/Favoritos";
import Perfil from "../screens/Perfil";

const Tab = createBottomTabNavigator();

export default function BottonTab({ route }) {
    const { usuTemp } = route.params;

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
                tabBarActiveTintColor: '#3498db',
                tabBarInactiveTintColor: '#888',
            })}
        >
            <Tab.Screen name="Home" component={Home} initialParams={{ usuTemp }} />
            <Tab.Screen name="Favoritos" component={Favoritos} />
            <Tab.Screen name="Perfil" component={Perfil} />
        </Tab.Navigator>
    );
}