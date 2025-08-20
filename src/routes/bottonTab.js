import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "./screens/home";
import Perfil from "../screens/Perfil";

const Tab = createBottomTabNavigator();

export default function BottonTab() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Perfil" component={Perfil} />
        </Tab.Navigator>
    );
}