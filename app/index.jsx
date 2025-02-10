

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
// import CameraScreen from "./screens/CameraScreen";
import DetailsScreen from "./screens/DetailsScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
   
      <Stack.Navigator initialRouteName="BreakDownClosure">
        <Stack.Screen name="BreakDownClosure" component={HomeScreen} options={{headerShown:true}} />
        {/* <Stack.Screen name="Camera" component={CameraScreen} /> */}
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
  
  );
}

// import React, { useState } from "react";
// import { View, Text, TextInput, StyleSheet, Alert } from "react-native";

// export default function App() {
//   const [scannedData, setScannedData] = useState("");
//   const [scannerAvailable, setScannerAvailable] = useState(false);

//   const handleScan = (data) => {
//     setScannedData(data);
//     setScannerAvailable(true);
//     Alert.alert("Scanned Data", data);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Scanner Available: {scannerAvailable ? "✅ Yes" : "❌ No"}</Text>
//       <Text style={styles.text}>Scanned Data: {scannedData}</Text>

//       {/* This input field captures external scanner input */}
//       <TextInput
//         style={styles.hiddenInput}
//         autoFocus
//         onChangeText={handleScan}
//         placeholder="Scan QR Code here..."
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   text: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   hiddenInput: {
//     height: 0,
//     width: 0,
//     opacity: 0, // Hide the input field
//   },
// });
