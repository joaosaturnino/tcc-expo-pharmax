import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import CadUsuario from "../screens/CadUsuario";
import EsqSenha from "../screens/EsqSenha";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="CadUsuario" component={CadUsuario} />
      <Stack.Screen name="EsqSenha" component={EsqSenha} />
    </Stack.Navigator>
  );
}
