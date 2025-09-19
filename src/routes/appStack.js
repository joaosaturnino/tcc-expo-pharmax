import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "./bottonTab";
import Pesquisa from "../screens/Pesquisa";
import Categoria from "../screens/Categoria";
import Produto from "../screens/produto";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BottomTab"
        component={BottomTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pesquisa"
        component={Pesquisa}
        options={{ title: "Pesquisa" }}
      />
      <Stack.Screen
        name="Categoria"
        component={Categoria}
        options={{ title: "Categoria" }}
      />
      <Stack.Screen
        name="Produto"
        component={Produto}
        options={{ title: "Produto" }}
      />
    </Stack.Navigator>
  );
}
