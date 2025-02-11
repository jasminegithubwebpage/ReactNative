import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, Button, TouchableOpacity, Platform } from 'react-native';
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
    if (!data) return;
  
    let requestBody = {
      t_dcnum: inputText, // DC Number
    };
  
    let count = 1; // To track the index for t_retqty2, t_retqty3, etc.
  
    Object.keys(returnData).forEach((key) => {
      if (key.startsWith("retqty_") || key.startsWith("retdt_")) {
        const index = key.split("_")[1]; // Extract index from keys like retqty_1, retdt_1, etc.
        const qtyKey = `retqty_${index}`;
        const dateKey = `retdt_${index}`;
  
        if (count === 1) {
          // First entry should be without a number
          requestBody["t_retqty"] = returnData[qtyKey] || "0";
          requestBody["t_retdate"] = returnData[dateKey] || new Date().toISOString();
        } else {
          // Subsequent entries should have a number (t_retqty2, t_retqty3, ...)
          requestBody[`t_retqty${count}`] = returnData[qtyKey] || "0";
          requestBody[`t_retdate${count}`] = returnData[dateKey] || new Date().toISOString();
        }
        count++; // Increase count for the next set
      }
    });
  
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
        alert("Return data submitted successfully!");
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
    <View style={styles.container}>
      {/* Dispatch Details */}
      <View style={styles.dispatchCard}>
        <Text style={styles.title}>Dispatch Details</Text>
        <Text style={styles.label}>Name: <Text style={styles.value}>{data.t_name}</Text></Text>
        <Text style={styles.label}>Address: <Text style={styles.value}>{`${data.t_ln02}, ${data.t_ln03}, ${data.t_ccty}, ${data.t_cste}`}</Text></Text>
        <Text style={styles.label}>Status: <Text style={[styles.status, { color: data.t_dcstatus === 1 ? 'green' : data.t_dcstatus === 2 ? 'red' : 'gray' }]}>{statusMapping[data.t_dcstatus]}</Text></Text>
      </View>

      {/* Item List */}
      <FlatList
        data={Object.keys(data)
          .filter(key => key.startsWith('item_') && data[key] && data[`Qty_${key.split('_')[1]}`] > 0)
          .map(key => {
            const index = key.split('_')[1];

            return {
              index, // Keep index reference
              item: data[key].trim(),
              description: data[`item_desc_${index}`],
              qty: data[`Qty_${index}`],
              value: data[`val_${index}`],
              remark: data[`remark_${index}`],
              uom: uomMapping[data[`uom_${index}`]] || 'UNKNOWN',
              hsn: data[`hsn_${index}`] || 'N/A',
              returnQty: returnData[`retqty_${index}`] || '',
              returnDate: returnData[`retdt_${index}`] || ''
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
              onChangeText={text => handleReturnChange(item.index, 'retqty', text)}
            />

            {/* Return Date Picker */}
            <Text style={styles.label}>Return Date:</Text>
            <TouchableOpacity onPress={() => openDatePicker(item.index)} style={styles.dateInput}>
              <Text>{returnData[`retdt_${item.index}`]}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Submit Button */}
      <Button title="Submit" onPress={handleSubmit} color="#007bff" />

      {/* Date Picker Component */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10
  },
  dispatchCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
    marginBottom: 10,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
});

export default DetailScreen;
