import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from '../screens/Login';
import CadUsuario from '../screens/CadUsuario';
import EsqSenha from '../screens/EsqSenha';
import Home from '../screens/Home';
import Pesquisa from '../screens/Pesquisa';
import Categoria from '../screens/Categoria';
import Produto from '../screens/produto';
import BottomTab from "./bottonTab";
import { Button } from "@react-navigation/elements";

const Stack = createNativeStackNavigator();

function StackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false 
      }}
      initialRouteName="Login"
    >
      {/* Telas de autenticação */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="CadUsuario" component={CadUsuario} />
      <Stack.Screen name="EsqSenha" component={EsqSenha} />
      
      {/* Navegação principal via BottomTab */}
      <Stack.Screen 
        name="Main" 
        component={BottomTab} 
        options={{
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
      
      {/* Telas específicas */}
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
    </Stack.Navigator>
  );
}

export default StackNavigation;