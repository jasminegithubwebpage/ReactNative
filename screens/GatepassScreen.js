import React, { useState} from 'react';
import { useFocusEffect } from "@react-navigation/native";

import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CameraView } from 'expo-camera';

const GatepassScreen = () => {
  const navigation = useNavigation();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [inputText, setInputText] = useState("");
  const [useExternalScanner, setUseExternalScanner] = useState(false);

  const handleExternalScan = (data) => {
     setInputText(data);
  
  
      navigation.navigate("DetailScreen", { inputText: data }); // Navigate with scanned breakdown number
    
  
   
  };
  const handleBarcodeScanned = ({ data }) => {
    setScanned(true);
    setCameraVisible(false);
    setInputText(data); // Store scanned data in inputText
  };
  useFocusEffect(
    React.useCallback(() => {
      // Reset camera visibility to false when the screen comes back into focus
      setCameraVisible(false);
      setInputText("");
      setScanned(false); 
    }, [])
  );
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Enter or Scan QR Code" 
          value={inputText}
          onChangeText={setInputText} 
        />
        <TouchableOpacity style={styles.button} onPress={() => setCameraVisible(true)}>
          <Text style={styles.buttonText}>Scan QR</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('DetailScreen', { inputText })}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '60%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  camera: {
    marginVertical: 10,
    width: 200,
    height: 200,
  }
});

export default GatepassScreen;
