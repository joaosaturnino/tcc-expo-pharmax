import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';

import RootNavigation from './rootNavigation';

export default function Navegacao() {
    return (
        <NavigationContainer>
            <RootNavigation />
            <StatusBar style="auto" />
        </NavigationContainer>
    );
}
