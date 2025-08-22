import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../screens/Home";
import Favoritos from "../screens/Favoritos";
import Perfil from "../screens/Perfil";
   

const Tab = createBottomTabNavigator();

export default function BottonTab({route}) {

    const { usuTemp } = route.params;

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} initialParams={{ usuTemp }}/>
            <Tab.Screen name="Favoritos" component={Favoritos} />
            <Tab.Screen name="Perfil" component={Perfil} />
        </Tab.Navigator>
    );
}