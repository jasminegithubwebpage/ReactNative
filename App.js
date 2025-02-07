import { StyleSheet, Text, View } from 'react-native';
import {Homescreen} from './screens/Homescreen';
import { createStackNavigator } from "@react-navigation/stack";
export default function App() {
  return (
    <View style={styles.container}>
       <Stack.Navigator initialRouteName="Home">
       <Stack.Screen name="Home" component={Homescreen} options={{headerShown:true}} />

       </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
