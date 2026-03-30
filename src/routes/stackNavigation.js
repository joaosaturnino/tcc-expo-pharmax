import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Autenticação
import Login from '../screens/Login';
import Usuario from '../screens/Usuario';
import Senha from '../screens/Senha';

// Navegação Principal (Abas)
import BottonTab from "./bottonTab";

const Stack = createStackNavigator();

export default function StackNavigation() {
    return (
        <Stack.Navigator initialRouteName="Login">

            {/* FLUXO DE LOGIN (Sem abas) */}
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Usuario" 
                component={Usuario}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Senha" 
                component={Senha}
                options={{ headerShown: false }}
            />

            {/* FLUXO DO APP (Com abas) */}
            <Stack.Screen
                name="BottonTab"
                component={BottonTab}
                options={{
                    headerShown: false,       
                    headerBackVisible: false, 
                    gestureEnabled: false,    
                }}
            />

        </Stack.Navigator>
    );
}