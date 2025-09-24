import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';

import StackNavigation from './stackNavigation';
import Laboratorio from '../screens/laboratorio';

export default function Navegacao() {
    return (
        <NavigationContainer>
            <StackNavigation />
            <StatusBar style="auto" />
        </NavigationContainer>
    );
}