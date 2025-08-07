import { createNativeStackNavigator  } from "@react-navigation/native-stack";

import Login from '../screens/Login';
import CADUSUARIO from '../screens/CadUsuario';
import ESQSENHA from '../screens/EsqSenha';
import Home from '../screens/home';

const Stack = createNativeStackNavigator();

export default function Tab() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="CadUsuario" component={CADUSUARIO} />
            <Stack.Screen name="EsqSenha" component={ESQSENHA} />
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    );
}