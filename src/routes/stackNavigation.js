import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import CadUsuario from '../screens/CadUsuario';
import EsqSenha from '../screens/EsqSenha';
import Home from '../screens/Home';
import Pesquisa from '../screens/Pesquisa';
import Categoria from '../screens/Categoria';
import Produto from '../screens/produto';
import Favoritos from '../screens/Favoritos';
import Perfil from '../screens/Perfil';
import Laboratorio from '../screens/laboratorio';
import BottonTab from "./bottonTab";
import { Button } from "@react-navigation/elements";

const Stack = createStackNavigator();

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
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Favoritos" component={Favoritos} />
            <Stack.Screen name="Perfil" component={Perfil} />
            <Stack.Screen name="Laboratorio" component={Laboratorio} />
        </Stack.Navigator>
    );
}