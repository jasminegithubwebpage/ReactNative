import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import jsonData from './data.json';

const DataScreen = ({ route }) => {
    const {inputText} = route.params||{};
  const [data, setData] = useState(
    jsonData.map((item) => ({
      ...item,
      
      returnQuantity: 1,
      returnDate: new Date(),
      showDatePicker: false, // Controls visibility of date picker
    }))
  );

  const updateField = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const showDatePicker = (index) => {
    const newData = [...data];
    newData[index].showDatePicker = true;
    setData(newData);
  };

  const onDateChange = (event, selectedDate, index) => {
    if (selectedDate) {
      const newData = [...data];
      newData[index].returnDate = selectedDate;
      newData[index].showDatePicker = false;
      setData(newData);
    }
  };

  return (
    <View style={styles.container}>
        <Text>Received Input: {inputText}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.Sno.toString()}
        renderItem={({ item, index }) => (
            <View style={styles.card}>
            <Text style={styles.title}>{item.Item}</Text>
            <Text style={styles.description}>{item.Description}</Text>
            <Text style={styles.detail}>HSN Code: {item["HSN Code"]}</Text>
          
            {/* Quantity Field */}
            <View style={styles.row}>
            
              <Text style={styles.label}>Quantity:</Text>
              <Text style={styles.value}>{item.Quantity}</Text>
            </View>
          
            {/* Return Quantity Field */}
            <View style={styles.row}>
              <Text style={styles.label}>Return Quantity:</Text>
              <TextInput 
                style={styles.smallInput} 
                value={String(item.returnQuantity)}
                onChangeText={(text) => updateField(index, "returnQuantity", text)}
                keyboardType="numeric"
              />
            </View>
          
            {/* Value Field */}
            <View style={styles.row}>
              <Text style={styles.label}>Value:</Text>
              <Text style={styles.value}>₹{item.Value}</Text>
            </View>
          
            {/* Return Date with Date Picker */}
            <View style={styles.row}>
              <Text style={styles.label}>Return Date:</Text>
              <TouchableOpacity style={styles.dateButton} onPress={() => showDatePicker(index)}>
                <Text style={styles.dateText}>{item.returnDate.toDateString()}</Text>
              </TouchableOpacity>
            </View>
          
            {item.showDatePicker && (
              <DateTimePicker
                value={item.returnDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => onDateChange(event, selectedDate, index)}
              />
            )}
              {/* Value Field */}
              <View style={styles.row}>
              <Text style={styles.label}>Purpose:</Text>
              <Text style={styles.value}>{item.Purpose}</Text>
            </View>
            
          </View>
          
        )}
        
      />
          
          <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>  

    </View>
    
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 10,
    },
    card: {
      backgroundColor: '#fff',
      padding: 15,
      marginVertical: 8,
      borderRadius: 10,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    description: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    label: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
      width: 120, // Fixed width for proper alignment
    },
    purpose:{
        fontSize:14,
        fontWeight:'bold'
    },
    value: {
      fontSize: 14,
      color: '#444',
      flex: 1, // Align value text
    },
    smallInput: {
      height: 35,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 5,
      width: 60, // Smaller input box
      textAlign: 'center',
    },
    dateButton: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 5,
      borderRadius: 5,
      width: 120,
    },
    dateText: {
      textAlign: 'center',
      color: '#007bff',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        alignSelf: 'center',
        width:190,
        
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign:'center',
      },
  });
  
export default DataScreen;
