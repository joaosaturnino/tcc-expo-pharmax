import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';

// Importa a navegação de pilha que acabamos de conferir
import StackNavigation from './stackNavigation';

// 1. Importar o Provider de Notificações
import { NotificationProvider } from '../contexts/NotificationContext';

export default function Navegacao() {
    return (
        // 2. O Provider envolve toda a navegação para que o "Sino" funcione em qualquer tela
        <NotificationProvider>
            <NavigationContainer>
                <StackNavigation />
                {/* StatusBar Global (Estilo automático: escuro/claro dependendo do tema) */}
                <StatusBar style="auto" />
            </NavigationContainer>
        </NotificationProvider>
    );
}