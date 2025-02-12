import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, FlatList, Button, TouchableOpacity, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard ,ActivityIndicator
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

const DetailScreen = ({ route }) => {
  const { inputText } = route.params || {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returnData, setReturnData] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // UOM Mapping
  const uomMapping = { 1: 'NOS', 2: 'KGS', 3: 'SET', 4: 'LTS', 5: 'MTS' };
  const statusMapping = { 1: 'Open', 2: 'Closed', 3: 'Canceled' };

  useEffect(() => {
    if (inputText) {
      fetch(`http://192.168.101.13:5779/dc_details?dcnum=${inputText}`)
        .then(response => response.json())
        .then(responseData => {
          if (Array.isArray(responseData) && responseData.length > 0) {
            const fetchedData = responseData[0];
            setData(fetchedData);
  
            // Initialize returnData only for valid items
            const newReturnData = {};
            Object.keys(fetchedData).forEach(key => {
              if (key.startsWith('item_')) {
                const index = key.split('_')[1];
  
                // Only initialize return data if the quantity is greater than zero
                if (fetchedData[`Qty_${index}`] > 0) {
                  newReturnData[`retdt_${index}`] = new Date().toISOString().split('T')[0]; // Default date
                  newReturnData[`retqty_${index}`] = ''; // Empty return quantity
                }
              }
            });
  
            setReturnData(newReturnData);
          } else {
            setData(null);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [inputText]);
  

  // Handle return quantity and date changes
  const handleReturnChange = (index, key, value) => {
    setReturnData(prevState => ({
      ...prevState,
      [`${key}_${index}`]: key === 'retqty' ? String(Number(value)) : value // Ensure numeric input is formatted correctly
    }));
  };

  // Open DatePicker for a specific item
  const openDatePicker = (index) => {
    setSelectedIndex(index);
    setShowDatePicker(true);
  };

  // Handle date selection
  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      if (selectedIndex !== null) {
        handleReturnChange(selectedIndex, 'retdt', formattedDate);
      }
    }
    setShowDatePicker(false);
  };

  const handleSubmit = () => {
    console.log(data);
    if (!data) return;

    let requestBody = {
        t_dcnum: inputText, // DC Number
    };

    let count = 1; // Track valid return items
    let allReturned = true; // Flag to check if all quantities are returned

    Object.keys(returnData).forEach((key) => {
        if (key.startsWith("retqty_")) {
            const index = key.split("_")[1];
            const qtyKey = `retqty_${index}`;
            const dateKey = `retdt_${index}`;

            let returnQty = parseInt(returnData[qtyKey] || 0); // Convert to number
            let originalQty = parseInt(data[`Qty_${index}`] || 0); // Get original quantity

            // Skip if returnQty is 0
            if (returnQty === 0 || isNaN(returnQty)) {
                allReturned = false;
                return;
            }

            // Check if all items are fully returned
            if (returnQty !== originalQty) {
                allReturned = false;
            }

            if (count === 1) {
                requestBody["t_retqty"] = String(returnQty); // Convert to string
                requestBody["t_retdate"] = String(returnData[dateKey] || new Date().toISOString().split("T")[0]);
            } else {
                requestBody[`t_retqty${count}`] = String(returnQty);
                requestBody[`t_retdate${count}`] = String(returnData[dateKey] || new Date().toISOString().split("T")[0]);
            }
            count++;
        }
    });

    // Change status to 'Closed' if all items are returned
    if (allReturned) {
        requestBody["t_dcstatus"] = "2"; // Convert to string
    }

    console.log("Final Request Body:", requestBody);

    // Make API request
    fetch("http://192.168.101.13:5779/update_dc_details", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    })
    .then((response) => response.json())
    .then((result) => {
        console.log("API Response:", result);
        setReturnData({});
    })
    .catch((error) => {
        console.error("Error submitting data:", error);
        alert("Failed to submit return data.");
    });
};


  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No data found</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Dispatch Details */}
          <View style={styles.dispatchCard}>
            <Text style={styles.title}>Dispatch Details</Text>
            <Text style={styles.label}>Name: <Text style={styles.value}>{data.t_name}</Text></Text>
            <Text style={styles.label}>Address: <Text style={styles.value}>{`${data.t_ln02}, ${data.t_ln03}, ${data.t_ccty}, ${data.t_cste}`}</Text></Text>
            <Text style={styles.label}>
              Status: <Text style={[styles.status, { color: data.t_dcstatus === 1 ? "green" : data.t_dcstatus === 2 ? "red" : "gray" }]}>
                {statusMapping[data.t_dcstatus]}
              </Text>
            </Text>
          </View>

          {/* Item List */}
          <FlatList 
             keyboardShouldPersistTaps="handled"
             nestedScrollEnabled={true}
             scrollEnabled={true}
             removeClippedSubviews={false} // Prevents cutting off items
             contentContainerStyle={{ paddingBottom: 100 }}
            data={Object.keys(data)
              .filter(key => key.startsWith("item_") && data[key] && data[`Qty_${key.split("_")[1]}`] > 0)
              .map(key => {
                const index = key.split("_")[1];
                return {
                  index, // Keep index reference
                  item: data[key].trim(),
                  description: data[`item_desc_${index}`],
                  qty: data[`Qty_${index}`],
                  value: data[`val_${index}`],
                  remark: data[`remark_${index}`],
                  uom: uomMapping[data[`uom_${index}`]] || "UNKNOWN",
                  hsn: data[`hsn_${index}`] || "N/A",
                  returnQty: returnData[`retqty_${index}`] || "",
                  returnDate: returnData[`retdt_${index}`] || "",
                };
              })
            }
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.itemTitle}>{item.item}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.label}>Quantity: <Text style={styles.value}>{item.qty} {item.uom}</Text></Text>
                <Text style={styles.label}>Value: <Text style={styles.value}>₹{item.value}</Text></Text>
                <Text style={styles.label}>Remark: <Text style={styles.value}>{item.remark}</Text></Text>
                <Text style={styles.label}>HSN Code: <Text style={styles.value}>{item.hsn}</Text></Text>

                {/* Return Quantity Input */}
                <Text style={styles.label}>Return Quantity:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(item.returnQty)}
                  onChangeText={text => handleReturnChange(item.index, "retqty", text)}
                />

                {/* Return Date Picker */}
                <Text style={styles.label}>Return Date:</Text>
                <TouchableOpacity onPress={() => openDatePicker(item.index)} style={styles.dateInput} activeOpacity={1}>
                  <Text>{returnData[`retdt_${item.index}`] || "Select Date"}</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Submit Button */}
          <Button title="Submit" onPress={() => handleSubmit()} color="#007bff" />

          {/* Date Picker Component */}
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = {
  container: { flex: 1, padding: 20 },
  dispatchCard: { padding: 10, backgroundColor: "#f9f9f9", borderRadius: 5, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  label: { fontSize: 14, fontWeight: "bold", marginTop: 5 },
  value: { fontSize: 14, fontWeight: "normal" },
  status: { fontSize: 14, fontWeight: "bold" },
  card: { backgroundColor: "#fff", padding: 10, borderRadius: 5, marginBottom: 10, elevation: 2 },
  itemTitle: { fontSize: 16, fontWeight: "bold" },
  description: { fontSize: 14, color: "#666" },
  input: { borderBottomWidth: 1, borderColor: "#ccc", padding: 5, fontSize: 14 },
  dateInput: { padding: 10, backgroundColor: "#eee", borderRadius: 5, marginTop: 5 },
};

export default DetailScreen;