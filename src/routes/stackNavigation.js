import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from '../screens/Login';
import CadUsuario from '../screens/CadUsuario';
import EsqSenha from '../screens/EsqSenha';
import Home from '../screens/Home';
import Pesquisa from '../screens/Pesquisa';
import Categoria from '../screens/Categoria'; // <-- Adicione esta linha
import Produto from '../screens/produto'; // Adicione este import
import BottonTab from "./bottonTab";
import { Button } from "@react-navigation/elements";



const Stack = createNativeStackNavigator();

export default function Tab() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="CadUsuario" component={CadUsuario} />
            <Stack.Screen name="EsqSenha" component={EsqSenha} />
            <Stack.Screen
                name="BottonTab"
                component={BottonTab}
                options={{
                    headerShown: false,
                    headerBackVisible: false,
                    gestureEnabled: false,
                }}
            />
            <Stack.Screen
                name="Pesquisa"
                component={Pesquisa}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Categoria"
                component={Categoria}
                options={{
                    headerShown: true,
                    title: 'Categoria',
                }}
            />
            <Stack.Screen
                name="Produto"
                component={Produto}
                options={{
                    headerShown: true,
                    title: 'Produto',
                }}
            />

        </Stack.Navigator>
    );
}