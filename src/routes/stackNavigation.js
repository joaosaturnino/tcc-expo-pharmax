import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Certifique-se que os nomes das pastas estão corretos
import Login from '../screens/Login';
import Usuario from '../screens/Usuario'; // Ajustado para importar a tela de Cadastro
import Senha from '../screens/Senha';
import Home from '../screens/Home';
import Pesquisa from '../screens/Pesquisa';
import Categoria from '../screens/Categoria';
import Produto from '../screens/produto';
import Favoritos from '../screens/Favoritos';
import Perfil from '../screens/Perfil';
import Laboratorio from '../screens/laboratorio';
import Farmacia from '../screens/farmacia';
import Listagem from '../screens/Listagem';
import BottonTab from "./bottonTab";

const Stack = createStackNavigator();

export default function StackNavigation() {
    return (
        <Stack.Navigator>
            
            {/* TELA DE LOGIN: Cabeçalho removido aqui */}
            <Stack.Screen 
                name="Login" 
                component={Login} 
                options={{ headerShown: false }} 
            />

            {/* TELA DE CADASTRO: Nome ajustado para 'CadUsuario' e cabeçalho removido */}
            <Stack.Screen 
                name="Usuario" 
                component={Usuario} 
                options={{ headerShown: false }} 
            />

            {/* TELA DE SENHA: Cabeçalho removido */}
            <Stack.Screen 
                name="Senha" 
                component={Senha} 
                options={{ headerShown: false }} 
            />

            {/* NAVEGAÇÃO DAS ABAS (Home, Perfil, Favoritos) */}
            <Stack.Screen
                name="BottonTab"
                component={BottonTab}
                options={{
                    headerShown: false,
                    headerBackVisible: false,
                    gestureEnabled: false,
                }}
            />

            {/* OUTRAS TELAS */}
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
                options={{ headerShown: true, title: 'Produto' }}
            />

            <Stack.Screen 
        name="Listagem" 
        component={Listagem} 
        options={{ headerShown: true }} 
    />

            <Stack.Screen name="Laboratorio" component={Laboratorio} />
            <Stack.Screen name="Farmacia" component={Farmacia} />

            {/* OBS: Home, Favoritos e Perfil já estão dentro do BottonTab, 
                então não precisam necessariamente estar aqui, a menos que 
                você queira acessá-las fora das abas. Mantive por garantia. */}
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Favoritos" component={Favoritos} />
            <Stack.Screen name="Perfil" component={Perfil} />

        </Stack.Navigator>
    );
}