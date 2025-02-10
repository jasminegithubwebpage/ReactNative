import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Homescreen from './screens/Homescreen';
import GatepassScreen from './screens/GatepassScreen';
import DataScreen from './screens/DataScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="GatePass" component={Homescreen} />
        <Stack.Screen name="GatepassScreen" component={GatepassScreen} />
        <Stack.Screen name="DataScreen" component={DataScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
