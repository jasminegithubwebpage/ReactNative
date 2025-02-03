


import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";
import { Card } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import axios from 'axios';

export default function HomeScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [machineNo, setMachineNo] = useState("");
  const [breakdownNumber, setBreakdownNumber] = useState([]);  // State for breakdown numbers (initially an empty array)
  const [selectBreakDownNumber, setSelectedBreakDownNumber] = useState("");  // State for selected breakdown number
  const [loading, setLoading] = useState(false); 
  const [scanType,setScanType] = useState("");
  const [useExternalScanner, setUseExternalScanner] = useState(false);
const [externalScannedData, setExternalScannedData] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      // Reset camera visibility to false when the screen comes back into focus
      setCameraVisible(false);
      setInputCode("");
      setBreakdownNumber([]); // Reset the breakdown list when screen is opened
      setSelectedBreakDownNumber("");
      setMachineNo("");
    }, [])
  );
// Fetch breakdown numbers when machine number changes
useEffect(() => {
  const fetchBreakDownNum = async () => {
    if (!machineNo) return; // Wait for a valid machine number

    setLoading(true); // Start loading
    try {
      const apiURL = `http://192.168.101.13:5778/bdno_from_mcno?mcno=${machineNo}`;

      console.log("Fetching breakdown numbers", apiURL);

      const response = await axios.get(apiURL, {
        headers: { "Content-Type": "application/json" },
      });

      if (Array.isArray(response.data)) {
        console.log("Fetched breakdown numbers:", response.data);
        setBreakdownNumber(response.data); // Set fetched breakdown numbers
      } else {
        console.error("Unexpected response format:", response.data);
        setBreakdownNumber([]); // Clear breakdown numbers if data format is not valid
      }
    } catch (error) {
      console.error("Error fetching breakdown data:", error.message);
      setBreakdownNumber([]); // Handle error by clearing breakdown numbers
    } finally {
      setLoading(false); // Stop loading
    }
  };

  fetchBreakDownNum(); // Trigger API call when machineNo changes

}, [machineNo]); // Run useEffect when machineNo changes


const handleExternalScan = (data) => {
  setExternalScannedData(data);

  if (scanType === "breakdown") {
    navigation.navigate("Details", { breakDownNumber: data }); // Navigate with scanned breakdown number
  } else if (scanType === "machine") {
    setMachineNo(data); // Set scanned machine number
  }

  Alert.alert("Scanned Data", data);
};

  
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
  
    if (scanType === "breakdown") {
      navigation.navigate("Details", { breakDownNumber: data });  // Navigate to Details page with the scanned breakdown number
    } else if (scanType === "machine") {
      setMachineNo(data); // Set machine number from scan
      setCameraVisible(false); // Close the camera after scanning the machine number
    }
    
    // Reset camera visibility to allow re-scanning
    setScanned(false); // Reset the scan state to enable scanning again
  };
  

  const handleSubmitCode = () => {
    navigation.navigate("Details", { breakDownNumber :inputCode });
   
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Top Card for Input and QR Scan */}
      <Card style={styles.card}>
        <View style={styles.detail}>
          <TextInput
            style={styles.input}
            placeholder="Enter code"
            value={inputCode}
            onChangeText={setInputCode}
          />
          <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setScanType("breakdown");  // Set action type to "scanMachine"
            setCameraVisible(true); 
            setScanned(false) // Show camera to scan Machine QR code
          }}
        >
          <Text style={styles.buttonText}>Scan BreakDown QR Code</Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmitCode}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </Card>

      {/* Bottom Card for Machine No, Dropdown, and Submit Button */}
      <Card style={styles.card}>
        <View style={styles.detail}>
          <TextInput
            style={styles.input}
            placeholder="Machine No"
            value={machineNo}
            onChangeText={setMachineNo}
          />
       <TouchableOpacity
  style={styles.button}
  onPress={() => {
    setScanType("machine");  // Set action type to "scanMachine"
    setCameraVisible(true);  // Always show camera to scan Machine QR code
    setScanned(false);  // Reset scanned state
  }}
>
  <Text style={styles.buttonText}>Scan Machine QR Code</Text>
</TouchableOpacity>

        </View>

         
    {/* Breakdown Picker */}
    <Text style={styles.header}>BreakDown Number:</Text>
    <View style={styles.pickerContainer}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {breakdownNumber.length > 0 ? (
            <Picker
              selectedValue={selectBreakDownNumber}
              onValueChange={(itemValue) => setSelectedBreakDownNumber(itemValue)}
              style={styles.picker}
            >
              {breakdownNumber.map((breakdown) => (
                <Picker.Item
                  key={breakdown.t_bdno}
                  label={`${breakdown.t_bdno}`}
                  value={breakdown.t_bdno}
                />
              ))}
            </Picker>
          ) : (
            <Picker
              selectedValue={selectBreakDownNumber}
              onValueChange={(itemValue) => setSelectedBreakDownNumber(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Breakdown Number" value="" />
            </Picker>
          )}
        </>
      )}
    </View>

        <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate("Details", {breakDownNumber:selectBreakDownNumber})}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </Card>

      {cameraVisible && !scanned && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr", "pdf417"] }}
          style={styles.camera}
        />
      )}
      <TextInput
  style={{ height: 0, width: 0, opacity: 0 }} // Hidden input field
  autoFocus={useExternalScanner} // Auto-focus if external scanner is active
  onChangeText={handleExternalScan} // Handle scanner input
  placeholder="Scan QR Code..."
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    padding: 16,
    marginVertical: 30,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 4,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: "dodgerblue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical:10
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  camera: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginTop: 20,
  },
  pickerContainer: {
    borderWidth: 1, // Add border width
    borderColor: "gray", // Add border color
    borderRadius: 5, // Rounded corners
    paddingHorizontal: 5, // Horizontal padding for better alignment
    marginTop: 10, // Space between elements
  },
  picker: {
    height: 50, // Set height for the picker
    width: "100%", // Full width inside the container
  },
  borderWrapper: {
    borderWidth: 1,
    borderColor: "gray", // You can adjust the color as needed
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
});


