import { createNativeStackNavigator  } from "@react-navigation/native-stack";

import Login from '../screens/Login';
import CadUsuario from '../screens/CadUsuario';
import EsqSenha from '../screens/EsqSenha';
import Home from '../screens/Home';
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
                name="ButtonTab" 
                component={ButtonTab}
                options={{
                    headerShown: false, // Esconde o cabeçalho da tela Home
                    headerBackVisible: false, // Esconde o botão de voltar
                    gestureEnabled: false, // Desabilita o gesto de voltar
            }} 
            />
        </Stack.Navigator>
    );
}