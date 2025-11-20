import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importação das Telas
import Login from '../screens/Login';
import Usuario from '../screens/Usuario';
import Senha from '../screens/Senha';
import Pesquisa from '../screens/Pesquisa';
import Categoria from '../screens/Categoria';
import Produto from '../screens/produto';
import Laboratorio from '../screens/laboratorio';
import Farmacia from '../screens/farmacia';
import Listagem from '../screens/Listagem';

// Importação do Navegador de Abas (que contém Home, Favoritos e Perfil)
import BottonTab from "./bottonTab";

const Stack = createStackNavigator();

export default function StackNavigation() {
    return (
        <Stack.Navigator initialRouteName="Login">

            {/* --- FLUXO DE AUTENTICAÇÃO --- */}

            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Usuario" // Tela de Cadastro
                component={Usuario}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Senha" // Recuperação de Senha
                component={Senha}
                options={{ headerShown: false }}
            />

            {/* --- FLUXO PRINCIPAL (APP LOGADO) --- */}

            {/* Ao logar, você deve navegar para "BottonTab".
                Ex: navigation.navigate('BottonTab', { userId: 123 })
                Isso carregará a Home com a barra inferior visível.
            */}
            <Stack.Screen
                name="BottonTab"
                component={BottonTab}
                options={{
                    headerShown: false,       // O cabeçalho é controlado pelas abas internas
                    headerBackVisible: false, // Impede voltar para o Login pelo botão nativo
                    gestureEnabled: false,    // Impede voltar deslizando o dedo (iOS)
                }}
            />

            {/* --- TELAS SECUNDÁRIAS (SEM ABAS OU SOBRE AS ABAS) --- */}

            <Stack.Screen
                name="Pesquisa"
                component={Pesquisa}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Categoria"
                component={Categoria}
                options={{ headerShown: true, title: 'Categoria' }}
            />

            <Stack.Screen
                name="Produto"
                component={Produto}
                options={{ headerShown: true, title: 'Detalhes do Produto' }}
            />

            <Stack.Screen
                name="Listagem"
                component={Listagem}
                options={{ headerShown: true, title: 'Lista de Produtos' }}
            />

            <Stack.Screen
                name="Laboratorio"
                component={Laboratorio}
                options={{ title: 'Laboratório' }}
            />

            <Stack.Screen
                name="Farmacia"
                component={Farmacia}
                options={{ title: 'Farmácia' }}
            />

        </Stack.Navigator>
    );
}