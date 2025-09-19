import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./authStack";
import AppStack from "./appStack";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  const isLogged = true; // aqui depois você coloca lógica de login (context, redux etc.)

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLogged ? (
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
