import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// Importações das telas
import Login from '../screens/Login';
import CadUsuario from '../screens/CadUsuario';
import EsqSenha from '../screens/EsqSenha';
import Home from '../screens/Home';
import Pesquisa from '../screens/Pesquisa';
import Favoritos from '../screens/Favoritos';
import Perfil from '../screens/Perfil';
import BottonTab from "./bottomTab";

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                {/* Telas de autenticação */}
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="CadUsuario"
                    component={CadUsuario}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EsqSenha"
                    component={EsqSenha}
                    options={{ headerShown: false }}
                />

                {/* Tela de pesquisa */}
                <Stack.Screen
                    name="Pesquisa"
                    component={Pesquisa}
                    options={{ headerShown: false }}
                />

                {/* Navegação por abas (BottomTab) */}
                <Stack.Screen
                    name="BottonTab"
                    component={BottonTab}
                    options={{
                        headerShown: false,
                        headerBackVisible: false,
                        gestureEnabled: false,
                    }}
                />

                {/* Telas adicionais (se necessário acessar diretamente) */}
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Favoritos"
                    component={Favoritos}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Perfil"
                    component={Perfil}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}