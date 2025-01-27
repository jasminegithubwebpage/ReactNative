// import React, { useState, useEffect } from "react";
// import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
// import { Camera, CameraView } from "expo-camera";
// import { useFocusEffect } from "@react-navigation/native";

// export default function HomeScreen({ navigation }) {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const [inputCode, setInputCode] = useState("");

//   useFocusEffect(
//     React.useCallback(() => {
//       // Reset camera visibility to false when the screen comes back into focus
//       setCameraVisible(false);
//     }, [])
//   );

//   useEffect(() => {
//     const getCameraPermissions = async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === "granted");
//     };

//     getCameraPermissions();
//   }, []);

//   const handleBarcodeScanned = ({ type, data }) => {
//     setScanned(true);
//     navigation.navigate("Details", { type: type, data: data });
//   };

//   const handleSubmitCode = () => {
//     navigation.navigate("Details", { type: "manual", data: inputCode });
//   };

//   if (hasPermission === null) {
//     return <Text>Requesting for camera permission...</Text>;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.detail}>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter code"
//           value={inputCode}
//           onChangeText={setInputCode}
//         />
//         <TouchableOpacity style={styles.button} onPress={() => setCameraVisible(true)}>
//           <Text style={styles.buttonText}>Scan QRcode</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.button} onPress={handleSubmitCode}>
//           <Text style={styles.buttonText}>Submit Code</Text>
//         </TouchableOpacity>
//       </View>

//       {cameraVisible && !scanned && (
//         <CameraView
//           onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
//           barcodeScannerSettings={{ barcodeTypes: ["qr", "pdf417"] }}
//           style={{ width: 300, height: 300 }}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   input: {
//     height: 40,
//     width: "40%", // Adjusted width for better visibility
//     borderColor: "gray",
//     borderWidth: 1,
//     borderRadius: 5,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
//   button: {
//     backgroundColor: "#007BFF",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginVertical: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   detail: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     marginBottom: 20,
//     width: "100%",
//     paddingHorizontal: 10,
//   },
//   buttonContainer: {
//     alignItems: "center",
//     marginTop: 15,
//   },
// });


import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import QRScanner from "react-qr-scanner"; // Import react-qr-scanner
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [inputCode, setInputCode] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      // Reset camera visibility to false when the screen comes back into focus
      setCameraVisible(false);
    }, [])
  );

  const handleBarcodeScanned = (data) => {
    setScanned(true);
    navigation.navigate("Details", { type: "qr", data: data });
  };

  const handleSubmitCode = () => {
    navigation.navigate("Details", { type: "manual", data: inputCode });
  };

  return (
    <View style={styles.container}>
      <View style={styles.detail}>
        <TextInput
          style={styles.input}
          placeholder="Enter code"
          value={inputCode}
          onChangeText={setInputCode}
        />
        <TouchableOpacity style={styles.button} onPress={() => setCameraVisible(true)}>
          <Text style={styles.buttonText}>Scan QRcode</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmitCode}>
          <Text style={styles.buttonText}>Submit Code</Text>
        </TouchableOpacity>
      </View>

      {cameraVisible && !scanned && (
        <QRScanner
          onScan={handleBarcodeScanned} // Use `onScan` for QRScanner
          style={{ width: 300, height: 300 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    width: "40%", // Adjusted width for better visibility
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  detail: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 15,
  },
});
