import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';

import StackNavigation from './stackNavigation';

export default function Navegacao() {
    return (
        <NavigationContainer>
            <StackNavigation />
            {/* Configura a barra de status do celular (bateria, hora) para se ajustar automaticamente */}
            <StatusBar style="auto" />
        </NavigationContainer>
    );
}