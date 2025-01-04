import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db, auth} from '../../firebaseConfig'; // Import your Firebase config
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { createNewVehicle, Vehicle } from '../../types/Vehicle'; // Import the Vehicle interface
import { router } from 'expo-router';
const AddVehicle = () => {
  const [vehicleName, setVehicleName] = useState('');
  const [initialOdometer, setInitialOdometer] = useState('');
  const [lastOilChange, setLastOilChange] = useState('');

  const handleAddVehicle = async () => {
    // Validate input
    if (!vehicleName || !initialOdometer || !lastOilChange) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Create a new vehicle object using the Vehicle interface
    const newVehicle = createNewVehicle(vehicleName, parseInt(initialOdometer), parseInt(lastOilChange), auth.currentUser?.uid);

    console.info(newVehicle);
    try {
      // Add vehicle to Firestore
      const vehicleDocRef = await addDoc(collection(db, 'vehicles'), newVehicle);
      
      // Ensure currentUser is defined
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) {
        Alert.alert('Error', 'User is not authenticated.');
        return;
      }

      // Update the user's document with the new vehicle's docId
      const userDocRef = doc(db, 'users', currentUserId); // Reference to the user's document
      await updateDoc(userDocRef, {
        ownedVehicles: arrayUnion(vehicleDocRef.id) // Add the new vehicle's docId to the ownedVehicles array
      });

      // Clear the fields after adding
      setVehicleName('');
      setInitialOdometer('');
      setLastOilChange('');
      Alert.alert('Success', 'Vehicle added successfully!');
    } catch (error) {
      console.error('Error adding vehicle: ', error);
      Alert.alert('Error', 'Could not add vehicle. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Vehicle</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Vehicle Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter vehicle name"
          value={vehicleName}
          onChangeText={setVehicleName}
        />
        
        <Text style={styles.label}>Initial Odometer</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter initial odometer"
          value={initialOdometer}
          onChangeText={setInitialOdometer}
          keyboardType="numeric"
        />
        
        <Text style={styles.label}>Last Oil Change Mileage</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter last oil change mileage"
          value={lastOilChange}
          onChangeText={setLastOilChange}
          keyboardType="numeric"
        />
        <Button title="Find Vehicle" onPress={() => router.push('/(home)/findvehicle')} />
        <Button title="Add Vehicle" onPress={handleAddVehicle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    width: '100%',
  },
  formContainer: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    marginTop: 12,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    width: '80%',
  },
});

export default AddVehicle;