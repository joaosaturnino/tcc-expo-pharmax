import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Exemplos from '../exemplos';
import Home from '../Home';

const TabNavigation = createBottomTabNavigator();

export default function Tab() {
  return (
    <TabNavigation.Navigator>
      <TabNavigation.Screen name="Exemplos" component={Exemplos} />
      <TabNavigation.Screen name="Home" component={Home} />
    </TabNavigation.Navigator>
  );
};
