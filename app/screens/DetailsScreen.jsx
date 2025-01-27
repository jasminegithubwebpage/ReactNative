import React, { useState, useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DetailsScreen({ route }) {

  const navigate = useNavigation();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(true);
  const { type, data } = route.params;
  const [stdServiceTime,setStdServiceTime] = useState(""); 
  const [maintenanceFrequency, setMaintenanceFrequency] = useState("");
  const [generalService, setGeneralService] = useState("");
  const [machineTurned, setMachineTurned] = useState("");
  const [repaired, setRepaired] = useState("");
  const [componentChanged, setComponentChanged] = useState("");
  const [consumable, setConsumable] = useState("");
  const [actualServiceTime, setActualServiceTime] = useState("");
  const [remarks, setRemarks] = useState("");
  const [observation, setObservation] = useState("");
  const [routeCause, setRouteCause] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");


 // States for start and end date/time
 const [startDate, setStartDate] = useState(new Date());
 const [endDate, setEndDate] = useState(new Date());
 const [startTime, setStartTime] = useState(new Date());
 const [endTime, setEndTime] = useState(new Date());
 
 const [show, setShow] = useState(false);
 const [mode, setMode] = useState("date");
 const [pickerType, setPickerType] = useState(""); // Track which picker to show (start/end date/time)
 
 const [text, setText] = useState('Empty');

 const showMode = (currentMode, type) => {  
   setShow(true);
   setMode(currentMode);
    setPickerType(type);
 };

 useEffect(() => {
  const fetchData = async () => {
    try {
      const apiURL = "http://tvsss.in/bdown/mtn_user.php";
     // http://tvsss.in/bdown/mtn_user.php
      console.log("Fetching employees from:", apiURL);
      const response = await axios.get(apiURL, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (Array.isArray(response.data)) {
        console.log("Fetched employees:", response.data);
        setEmployees(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employee data:", error.message);
      if (error.response) {
        console.error("Server response:", error.response);
      } else if (error.request) {
        console.error("No response from server:", error.request);
      }
      setLoading(false);
    }
  };
  fetchData();
}, []);

 console.log("hellos");
  const handleConfirm = () => {
    console.log("hello")
    // Format the startDate and startTime into SQL-compatible format (yyyy-MM-dd HH:mm:ss)
    const formattedStartDateTime = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')} ${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}:${startTime.getSeconds().toString().padStart(2, '0')}`;
  
    // Format the endDate and endTime into SQL-compatible format (yyyy-MM-dd HH:mm:ss)
    const formattedEndDateTime = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')} ${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}:${endTime.getSeconds().toString().padStart(2, '0')}`;
  
    // Log the formatted values for confirmation
    console.log("Formatted Start Date and Time:", formattedStartDateTime);
    console.log("Formatted End Date and Time:", formattedEndDateTime);
  
    // Continue with other data handling
    console.log("Selected Employee: ", selectedEmployee);
    console.log("Maintenance Frequency: ", maintenanceFrequency);
    console.log("General Service: ", generalService);
    console.log("Machine Turned: ", machineTurned);
    console.log("Repaired: ", repaired);
    console.log("Component Changed: ", componentChanged);
    console.log("Consumable: ", consumable);
    console.log("Actual Service Time: ", actualServiceTime);
    console.log("Remarks: ", remarks);
    console.log("Observation: ", observation);
    console.log("Route Cause: ", routeCause);
    console.log("Corrective Action: ", correctiveAction);
  
    // Use the navigate function to go back after confirming
    navigate.goBack();
  };
  



  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
 
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Scanned QR Code Details</Text>
      <Text>Type: {type}</Text>
      <Text>Data: {data}</Text>
      <Text style={styles.header}>Service Provider:</Text>
<View style={styles.pickerContainer}>
  {employees.length > 0 ? (
    <>
      <Picker
        selectedValue={selectedEmployee}
        onValueChange={(itemValue) => setSelectedEmployee(itemValue)}
        style={styles.picker}
      >
        {employees.map((employee) => (
          <Picker.Item
            key={employee.mpin}
            label={`${employee.nama}-${employee.mpin}`}
            value={employee.mpin}
          />
        ))}
      </Picker>
      {!selectedEmployee && (
        <View style={styles.borderWrapper}>
          <Text style={styles.selection}>No employee selected</Text>
        </View>
      )}
    </>
  ) : (
    <Text style={styles.noEmployee}>No employees available</Text>
  )}
</View>

  
      <Text style={styles.label}>Standard Service Time</Text>
      <TextInput
        style={styles.input}
        value={stdServiceTime}
        onChangeText={setStdServiceTime}
      />
  
      <Text style={styles.label}>Start Date</Text>
      <TextInput
        style={styles.input}
        value={startDate.toLocaleDateString()}
        onFocus={() => showMode("date", "startDate")}
        editable={true}
      />
  
      <Text style={styles.label}>Start Time</Text>
      <TextInput
        style={styles.input}
        value={startTime.toLocaleTimeString()}
        onFocus={() => showMode("time", "startTime")}
        editable={true}
      />
  
      <Text style={styles.label}>End Date</Text>
      <TextInput
        style={styles.input}
        value={endDate.toLocaleDateString()}
        onFocus={() => showMode("date", "endDate")}
        editable={true}
      />
  
      <Text style={styles.label}>End Time</Text>
      <TextInput
        style={styles.input}
        value={endTime.toLocaleTimeString()}
        onFocus={() => showMode("time", "endTime")}
        editable={true}
      />
  
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={
            pickerType === "startDate"
              ? startDate
              : pickerType === "endDate"
              ? endDate
              : pickerType === "startTime"
              ? startTime
              : endTime
          }
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShow(false); // Close the picker
            if (selectedDate) {
              // Update the correct state based on pickerType
              if (pickerType === "startDate") {
                setStartDate(selectedDate);
              } else if (pickerType === "endDate") {
                setEndDate(selectedDate);
              } else if (pickerType === "startTime") {
                setStartTime(selectedDate);
              } else if (pickerType === "endTime") {
                setEndTime(selectedDate);
              }
            }
          }}
        />
      )}
  
      <Text style={styles.label}>Maintenance Frequency</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={maintenanceFrequency}
          onValueChange={(itemValue) => setMaintenanceFrequency(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Frequency" value="" />
          <Picker.Item label="New" value="New" />
          <Picker.Item label="Old" value="Old" />
        </Picker>
      </View>
  
      {[{ label: "General Service", state: generalService, setter: setGeneralService },
        { label: "Machine Turned", state: machineTurned, setter: setMachineTurned },
        { label: "Repaired", state: repaired, setter: setRepaired },
        { label: "Component Changed", state: componentChanged, setter: setComponentChanged },
        { label: "Consumable", state: consumable, setter: setConsumable },
      ].map((item, index) => (
        <View key={index}>
          <Text style={styles.label}>{item.label}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={item.state}
              onValueChange={(value) => item.setter(value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Option" value="" />
              <Picker.Item label="Yes" value="Yes" />
              <Picker.Item label="No" value="No" />
            </Picker>
          </View>
        </View>
      ))}
  
      <Text style={styles.label}>Actual Service Time</Text>
      <TextInput
        style={styles.input}
        value={actualServiceTime}
        onChangeText={setActualServiceTime}
      />
  
      <Text style={styles.label}>Remarks</Text>
      <TextInput
        style={styles.input}
        value={remarks}
        onChangeText={setRemarks}
      />
  
      <Text style={styles.label}>Observation</Text>
      <TextInput
        style={styles.input}
        value={observation}
        onChangeText={setObservation}
      />
  
      <Text style={styles.label}>Route Cause</Text>
      <TextInput
        style={styles.input}
        value={routeCause}
        onChangeText={setRouteCause}
      />
  
      <Text style={styles.label}>Corrective Action</Text>
      <TextInput
        style={styles.input}
        value={correctiveAction}
        onChangeText={setCorrectiveAction}
      />
  
  <TouchableOpacity style={styles.button} onPress={handleConfirm}>
  <Text style={styles.buttonText}>Submit</Text>
</TouchableOpacity>
    </ScrollView>
  );
  
}
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
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
  label: {
    marginTop: 10,
    fontSize: 16,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  selection: {
    marginTop: 20,
    fontSize: 16,
  },
  noEmployee: {
    fontSize: 16,
    color: "red",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  borderWrapper: {
    borderWidth: 1,
    borderColor: "gray", // You can adjust the color as needed
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
});


