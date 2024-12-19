import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Vehicle } from '../types/Vehicle'; // Import the Vehicle interface
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon library
import { db,functions } from '../firebaseConfig'; // Import your Firebase config
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import {httpsCallable } from 'firebase/functions'; // Import Firebase functions
import { firebase_functions } from 'firebase/functions'; // Import Firebase functions

interface VehicleDisplayProps {
  vehicles: Vehicle[];
  displayVehicleId: string | null;
  onVehicleDeselect: () => Promise<void>;
}

const VehicleDisplay: React.FC<VehicleDisplayProps> = ({ vehicles, displayVehicleId, onVehicleDeselect }) => {
  const [editedVehicle, setEditedVehicle] = useState<Vehicle | null>(null);
  const [emailInput, setEmailInput] = useState<string>(''); // State for email input

  // Find the corresponding vehicle based on displayVehicleId
  const vehicle = vehicles.find(v => v.id === displayVehicleId);

  // If a vehicle is found, set it to the editedVehicle state
  React.useEffect(() => {
    if (vehicle) {
      setEditedVehicle(vehicle);
    }
  }, [vehicle]);

  const handleNumericInputChange = (field: keyof Vehicle, value: string) => {
    if (editedVehicle) {
      const parsedValue = parseInt(value);

      // Check if parsedValue is a valid number
      if (!isNaN(parsedValue)) {
        const updatedVehicle = { ...editedVehicle, [field]: parsedValue };

        // Reset estimated miles to 0 if initial odometer is changed
        if (field === 'initialOdometer') {
          updatedVehicle.estimatedMiles = 0; // Reset estimated miles
        }

        setEditedVehicle(updatedVehicle);
      } else {
        // If parsedValue is NaN, set it to 0
        const updatedVehicle = { ...editedVehicle, [field]: 0 };
        setEditedVehicle(updatedVehicle);
        console.warn(`Invalid input for ${field}: ${value}. Setting to 0.`);
      }
    }
  };

  const handleStringInputChange = (field: keyof Vehicle, value: string) => {
    if (editedVehicle) {
      console.info("updateing string:" + value)
      const updatedVehicle = { ...editedVehicle, [field]: value.toLowerCase() };
      setEditedVehicle(updatedVehicle);
    }
  };

  

  const handleSubmit = async () => {
    if (editedVehicle) {
      try {
        // Update the vehicle in Firestore
        await setDoc(doc(db, 'vehicles', editedVehicle.id), editedVehicle);
        console.log('Vehicle updated successfully:', editedVehicle);
        onVehicleDeselect()
        // Optionally reset the form or perform any other actions after submission
      } catch (error) {
        console.error('Error updating vehicle:', error);
      }

    }
  };

  // Function to handle sending the invitation
  const handleSendInvitation = async () => {
    if (emailInput) {
      console.info("begin sending invitation");
      const sendInvitation = httpsCallable(functions, 'invite_user_to_vehicle'); // Use the name of your Firebase function

      try {
        const result = await sendInvitation({ vehicleId: editedVehicle?.id, userEmail: emailInput });
        console.info("result" + result); // Log the success message from the Firebase function
        // Clear the input after sending
        setEmailInput('');
      } catch (error) {
        const httpsError = error as firebase_functions.https_fn.HttpsError; // Type assertion
        if (httpsError.code && httpsError.message) { // Check if it's an HttpsError
          let userMessage = 'An error occurred while sending the invitation.';

          // Handle specific error codes
          switch (httpsError.code) {
            case 'unauthenticated':
              userMessage = 'You must be logged in to send an invitation.';
              break;
            case 'functions/not-found':
              userMessage = `${httpsError.message}`;
              break;
            case 'internal':
              userMessage = 'An internal error occurred. Please try again later.';
              break;
            default:
              userMessage = `Error: ${httpsError.message} (Code: ${httpsError.code})`;
          }

          console.info(`Error sending invitation: ${httpsError.message} (Code: ${httpsError.code})`);
          // Optionally, show the userMessage to the user (e.g., using a toast or alert)
          alert(userMessage); // Example of notifying the user
        } else {
          console.error('Error sending invitation:', error);
          alert('An unexpected error occurred. Please try again.'); // Notify for unexpected errors
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onVehicleDeselect} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Vehicle</Text>
        <View style={styles.backButton} />
      </View>
      {displayVehicleId ? (
        editedVehicle ? (
          <View>
            <Text style={styles.label}>Vehicle Name</Text>
            <TextInput
              style={styles.input}
              value={editedVehicle.vehicleName}
              onChangeText={value => handleStringInputChange('vehicleName', value)}
            />
            <Text style={styles.label}>Initial Odometer</Text>
            <TextInput
              style={styles.input}
              value={String(editedVehicle.initialOdometer)}
              onChangeText={value => handleNumericInputChange('initialOdometer', value)}
              keyboardType="numeric"
            />
            <Text style={styles.label}>Estimated Miles</Text>
            <TextInput
              style={styles.input}
              value={String(editedVehicle.estimatedMiles)}
              editable={false}
            />
            <Text style={styles.label}>Next Oil Change</Text>
            <TextInput
              style={styles.input}
              value={String(editedVehicle.nextOilChange)}
              onChangeText={value => handleNumericInputChange('nextOilChange', value)}
              keyboardType="numeric"
            />
            {/* Add more fields as necessary */}
            <Button title="Save Changes" onPress={handleSubmit} />
            <Text style={styles.label}>Shared with:</Text>
          {editedVehicle.invitedUsers.length > 0 ? (
            editedVehicle.invitedUsers.map((userId, index) => (
              <Text key={index}>{userId}</Text> // Replace userId with actual user data if available
            ))
          ) : (
            <Text>No users have access to this vehicle.</Text>
          )}
            <View style={styles.emailContainer}>
              <TextInput
                style={styles.emailInput}
                placeholder="Enter email to invite"
                value={emailInput}
                onChangeText={setEmailInput}
              />
              {emailInput ? (
                <TouchableOpacity onPress={handleSendInvitation}>
                  <Icon name="send" size={24} color="#000" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ) : (
          <Text>Loading vehicle data...</Text>
        )
      ) : (
        vehicles.map(vehicle => (
          <Text key={vehicle.id}>{vehicle.id}: {vehicle.estimatedMiles} miles</Text>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#fff',
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  emailInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: '#fff',
  },
});

export default VehicleDisplay; 