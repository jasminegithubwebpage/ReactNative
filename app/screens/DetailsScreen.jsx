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
  const [loadingBreakdown, setLoadingBreakdown] = useState(true);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
  const { breakDownNumber } = route.params;
  // console.log(breakDownNumber);
  const [stdServiceTime,setStdServiceTime] = useState(0); 
  const [maintenanceFrequency, setMaintenanceFrequency] = useState("");
  const [generalService, setGeneralService] = useState("");
  const [machineTurned, setMachineTurned] = useState("");
  const [repaired, setRepaired] = useState("");
  const [componentChanged, setComponentChanged] = useState("");
  const [consumable, setConsumable] = useState("");
  const [actualServiceTime, setActualServiceTime] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [observation, setObservation] = useState("");
  const [routeCause, setRouteCause] = useState("");
  const [correction,setCorrection] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  const [errors, setErrors] = useState({});
  const [breakdownDetails,setbreakdownDetails] = useState(null) 
  
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
  const fetchBreakdownDetails = async () => {
      try {
          if (!breakDownNumber) return;
          const apiURL = `http://192.168.101.13:5778/bd_details?bdno=${breakDownNumber}`;
          // console.log("Fetching breakdown details:", apiURL);

          const response = await axios.get(apiURL, { headers: { "Content-Type": "application/json" } });

          if (response.data.length > 0) {
              setbreakdownDetails(response.data[0]); // Fix: Take first item from array
          } else {
              console.error("No breakdown details found");
              setbreakdownDetails(null);
          }
      } catch (error) {
          console.error("Error fetching breakdown details:", error.message);
      } finally {
          setLoadingBreakdown(false);
      }
  };

  fetchBreakdownDetails();
}, [breakDownNumber]);

useEffect(() => {
  console.log("Updated Breakdown Details:", breakdownDetails);
}, [breakdownDetails]); // Logs updated state

useEffect(() => {
  const fetchEmployees = async () => {
    if (!breakdownDetails && !breakdownDetails.bd_class) {
      console.error("Error: breakdownDetails or bd_class is missing.");
      return; // Exit if bd_class is not available
    }

    try {
      const apiURL = `http://192.168.101.13:5778/person_by_dept?bd_class=${breakdownDetails.bd_class}`;
      console.log("Fetching employees from:", apiURL);

      const response = await axios.get(apiURL, { headers: { "Content-Type": "application/json" } });

      
      console.log("Full response:", response);  // ✅ Debugging

      if (Array.isArray(response.data)) {
        console.log("Fetched employees:", response.data);
        setEmployees(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setEmployees([]); // Set employees as empty array to avoid errors
      }
    } catch (error) {
      console.error("❌ Error fetching employee data:", error);
      console.error("Error Details:", error.response?.data || error.message);
    } finally {
      setLoadingEmployees(false);
    }
  };

  fetchEmployees();
}, [breakdownDetails]);

 // Make sure to re-run the effect if breakdownDetails change
  

  // Show loading if either API call is still in progress
  if (loadingBreakdown || loadingEmployees) {
      return <ActivityIndicator size="large" color="blue" />;
  }

  // Show error message if breakdown details are missing
  if (!breakdownDetails) {
      return <Text style={styles.errorText}>No details found for this breakdown number.</Text>;
  }

//  useEffect(() => {
//    const fetchData = async () => {
//      try {
//        const apiURL = "http://tvsss.in/bdown/mtn_user.php";  
 
//        console.log("Fetching employees from:", apiURL);
 
//        const response = await axios.get(apiURL, {
//          headers: { "Content-Type": "application/json" },
//        });
 
//        if (Array.isArray(response.data)) {
//          console.log("Fetched employees:", response.data);
//          setEmployees(response.data);
//        } else {
//          console.error("Unexpected response format:", response.data);
//        }
//      } catch (error) {
//        console.error("Error fetching employee data:", error.message);
 
//        if (error.response) {
//          console.error("Server response:", error.response.data);
//        } else if (error.request) {
//          console.error("No response from server:", error.request);
//        }
//      } finally {
//        setLoading(false);
//      }
//    };
 
//    fetchData();
//  }, []);
 


//  console.log("hellos");
 const handleConfirm = async() => {
  let newErrors = {};

  // Validate each field
  if (!selectedEmployee) newErrors.selectedEmployee = "Employee selection is required.";
  if (!stdServiceTime) newErrors.stdServiceTime = "Standard Service Time is required.";
  if (!startDate) newErrors.startDate = "Start Date is required.";
  if (!startTime) newErrors.startTime = "Start Time is required.";
  if (!endDate) newErrors.endDate = "End Date is required.";
  if (!endTime) newErrors.endTime = "End Time is required.";
  if (!maintenanceFrequency) newErrors.maintenanceFrequency = "Maintenance Frequency is required.";
  if (!generalService) newErrors.generalService = "Please select General Service.";
  if (!machineTurned) newErrors.machineTurned = "Please select Machine Turned.";
  if (!repaired) newErrors.repaired = "Please select Repaired.";
  if (!componentChanged) newErrors.componentChanged = "Please select Component Changed.";
  if (!consumable) newErrors.consumable = "Please select Consumable.";
  if (!actualServiceTime) newErrors.actualServiceTime = "Actual Service Time is required.";
  if (!remarks) newErrors.remarks = "Remarks are required.";
  if (!observation) newErrors.observation = "Observation is required.";
  if (!routeCause) newErrors.routeCause = "Route Cause is required.";
  if(!correction) newErrors.correction = "Correction is required";
  if (!correctiveAction) newErrors.correctiveAction = "Corrective Action is required.";

  // If there are errors, update state and prevent submission
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return; // Don't navigate back if there are errors
  }

  // Log before navigation to confirm data
  console.log("Form submitted successfully!");
const valueMapping = {
  "Yes": 1,
  "No": 2,
  "Not Applicable": 3,
};


// Function to convert selected values using the mapping
const convertToNumber = (value) => {
  return valueMapping[value];  // Default to 0 if not found
};
// Function to format date and time properly
const formatDateTime = (date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}.000`;
};

// Convert Start DateTime to minutes and add 330 minutes
const startDateTime = new Date(
  startDate.getFullYear(),
  startDate.getMonth(),
  startDate.getDate(),
  startTime.getHours(),
  startTime.getMinutes(),
  startTime.getSeconds()
);
startDateTime.setMinutes(startDateTime.getMinutes() + 330);
const formattedStartDateTime = formatDateTime(startDateTime);

// Convert End DateTime to minutes and add 330 minutes
const endDateTime = new Date(
  endDate.getFullYear(),
  endDate.getMonth(),
  endDate.getDate(),
  endTime.getHours(),
  endTime.getMinutes(),
  endTime.getSeconds()
);
endDateTime.setMinutes(endDateTime.getMinutes() + 330);
const formattedEndDateTime = formatDateTime(endDateTime);

// Log output
console.log("Formatted Start DateTime (Adjusted):", formattedStartDateTime);
console.log("Formatted End DateTime (Adjusted):", formattedEndDateTime);


  
  const SendData = {
    "t_bdno":breakDownNumber,
    "t_mtnpin":selectedEmployee,
    "t_stdtime":stdServiceTime,
    "t_start":formattedStartDateTime,
    "t_finish":formattedEndDateTime,
    "t_freq":JSON.stringify(maintenanceFrequency=="New"? 1:2),
    "t_gene":JSON.stringify(convertToNumber(generalService)),
    "t_turn":JSON.stringify(convertToNumber(machineTurned)),
    "t_repair":JSON.stringify(convertToNumber(repaired)),
    "t_cmpcg":JSON.stringify(convertToNumber(componentChanged)),
    "t_cons":JSON.stringify(convertToNumber(consumable)),
    "t_acthrs":actualServiceTime,
    "t_remark":remarks,
    "t_obsv":observation,
    "t_cause":routeCause,
    "t_corr":correction,
     "t_cact":correctiveAction,
      "t_stat":"9"
  }
  console.log("Details Send :", SendData); 
  try {
    const apiURL = "http://192.168.101.13:5778/update_bd_details";  

    const response = await axios.put(apiURL, SendData, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      console.log(response.message);
    } else {
      alert("Failed to submit data.");
    }
  } catch (error) {
    console.error("Error submitting data:", error.message);
    alert("Error submitting data. Please try again.");
  }

  // Clear errors after successful submission
  setErrors({});

  // Proceed with navigation after logging
  navigate.goBack();

};



  




  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
     {breakdownDetails ? (
    <>
        <Text style={styles.title}>Breakdown Details</Text>
        <Text style={styles.label}>Breakdown No: {breakdownDetails.t_bdno}</Text>
        <Text style={styles.label}>
    Breakdown Date: {breakdownDetails?.t_bddt ? breakdownDetails.t_bddt.split("T")[0] : "N/A"}
</Text>
<Text style={styles.label}>
    Breakdown Time: {breakdownDetails?.t_bddt ? breakdownDetails.t_bddt.split("T")[1] : "N/A"}
</Text>
        <Text style={styles.label}>Work Center: {breakdownDetails.WorkCenter_desc}</Text>
        <Text style={styles.label}>Description: {breakdownDetails.Brakdown_desc}</Text>
        <Text style={styles.label}>Machine Name: {breakdownDetails.Machine_Name}</Text>
        <Text style={styles.label}>Machine Code: {breakdownDetails.Machine_Code}</Text>
        
        <Text style={styles.label}>Breakdown Class: {breakdownDetails.bd_class}</Text>
    </>
) : (
    <Text>Loading breakdown details...</Text>
)}

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
  {/* {errors.selectedEmployee && <Text style={styles.errorText}>{errors.selectedEmployee}</Text>} */}
</View>

  
      <Text style={styles.label}>Standard Service Time</Text>
      <TextInput
        style={styles.input}
        value={stdServiceTime}
        onChangeText={setStdServiceTime}
      />
      {errors.stdServiceTime && <Text style={styles.errorText}>{errors.stdServiceTime}</Text>}
      <Text style={styles.label}>Start Date</Text>
      <TextInput
        style={styles.input}
        value={startDate.toLocaleDateString()}
        onFocus={() => showMode("date", "startDate")}
        editable={true}
      />
      {errors.startDate && <Text style={styles.errorText}>{errors.startDate}</Text>}
  
      <Text style={styles.label}>Start Time</Text>
      <TextInput
        style={styles.input}
        value={startTime.toLocaleTimeString()}
        onFocus={() => showMode("time", "startTime")}
        editable={true}
      />
      {errors.startTime && <Text style={styles.errorText}>{errors.startTime}</Text>}
  
      <Text style={styles.label}>End Date</Text>
      <TextInput
        style={styles.input}
        value={endDate.toLocaleDateString()}
        onFocus={() => showMode("date", "endDate")}
        editable={true}
      />
      {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}
  
      <Text style={styles.label}>End Time</Text>
      <TextInput
        style={styles.input}
        value={endTime.toLocaleTimeString()}
        onFocus={() => showMode("time", "endTime")}
        editable={true}
      />
      {errors.endTime && <Text style={styles.errorText}>{errors.endTime}</Text>}
  
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
    <Picker.Item label="Repeated" value="Repeated" />
  </Picker>
</View>
{errors.maintenanceFrequency && <Text style={styles.errorText}>{errors.maintenanceFrequency}</Text>}

<Text style={styles.label}>General Service</Text>
<View style={styles.pickerContainer}>
  <Picker
    selectedValue={generalService}
    onValueChange={(value) => setGeneralService(value)}
    style={styles.picker}
  >
    <Picker.Item label="Select Option" value="" />
    <Picker.Item label="Yes" value="Yes" />
    <Picker.Item label="No" value="No" />
    <Picker.Item label="Not Applicable" value="Not Applicable" />
  </Picker>
</View>
{errors.generalService && <Text style={styles.errorText}>{errors.generalService}</Text>}

<Text style={styles.label}>Machine Turned</Text>
<View style={styles.pickerContainer}>
  <Picker
    selectedValue={machineTurned}
    onValueChange={(value) => setMachineTurned(value)}
    style={styles.picker}
  >
    <Picker.Item label="Select Option" value="" />
    <Picker.Item label="Yes" value="Yes" />
    <Picker.Item label="No" value="No" />
    <Picker.Item label="Not Applicable" value="Not Applicable" />
  </Picker>
</View>
{errors.machineTurned && <Text style={styles.errorText}>{errors.machineTurned}</Text>}

<Text style={styles.label}>Repaired</Text>
<View style={styles.pickerContainer}>
  <Picker
    selectedValue={repaired}
    onValueChange={(value) => setRepaired(value)}
    style={styles.picker}
  >
    <Picker.Item label="Select Option" value="" />
    <Picker.Item label="Yes" value="Yes" />
    <Picker.Item label="No" value="No" />
    <Picker.Item label="Not Applicable" value="Not Applicable" />
  </Picker>
</View>
{errors.repaired && <Text style={styles.errorText}>{errors.repaired}</Text>}

<Text style={styles.label}>Component Changed</Text>
<View style={styles.pickerContainer}>
  <Picker
    selectedValue={componentChanged}
    onValueChange={(value) => setComponentChanged(value)}
    style={styles.picker}
  >
    <Picker.Item label="Select Option" value="" />
    <Picker.Item label="Yes" value="Yes" />

    <Picker.Item label="No" value="No" />
    <Picker.Item label="Not Applicable" value="Not Applicable" />
  </Picker>
</View>
{errors.componentChanged && <Text style={styles.errorText}>{errors.componentChanged}</Text>}

<Text style={styles.label}>Consumable</Text>
<View style={styles.pickerContainer}>
  <Picker
    selectedValue={consumable}
    onValueChange={(value) => setConsumable(value)}
    style={styles.picker}
  >
    <Picker.Item label="Select Option" value="" />
    <Picker.Item label="Yes" value="Yes" />
    <Picker.Item label="No" value="No" />
    <Picker.Item label="Not Applicable" value="Not Applicable" />
  </Picker>
</View>
{errors.consumable && <Text style={styles.errorText}>{errors.consumable}</Text>}


      <Text style={styles.label}>Actual Service Time</Text>
      <TextInput
        style={styles.input}
        value={actualServiceTime}
        onChangeText={setActualServiceTime}
      />
      {errors.actualServiceTime && <Text style={styles.errorText}>{errors.actualServiceTime}</Text>}
  
      <Text style={styles.label}>Remarks</Text>
      <TextInput
        style={styles.input}
        value={remarks}
        onChangeText={setRemarks}
      />
      {errors.remarks && <Text style={styles.errorText}>{errors.remarks}</Text>}
  
      <Text style={styles.label}>Observation</Text>
      <TextInput
        style={styles.input}
        value={observation}
        onChangeText={setObservation}
      />
      {errors.observation && <Text style={styles.errorText}>{errors.observation}</Text>}
  
      <Text style={styles.label}>Route Cause</Text>
      <TextInput
        style={styles.input}
        value={routeCause}
        onChangeText={setRouteCause}
      />
      {errors.routeCause && <Text style={styles.errorText}>{errors.routeCause}</Text>}
      <Text style={styles.label}>Correction</Text>
      <TextInput
        style={styles.input}
        value={correction}
        onChangeText={setCorrection}
      />
      {errors.correction  && <Text style={styles.errorText}>{errors.correction}</Text>}
  
      <Text style={styles.label}>Corrective Action</Text>
      <TextInput
        style={styles.input}
        value={correctiveAction}
        onChangeText={setCorrectiveAction}
      />
      {errors.correctiveAction && <Text style={styles.errorText}>{errors.correctiveAction}</Text>}
  
  <TouchableOpacity style={styles.button} onPress={handleConfirm}>
  <Text style={styles.buttonText}>Save & Submit</Text>
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  label: { fontSize: 16, marginBottom: 5 },
});


