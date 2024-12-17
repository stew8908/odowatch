import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { db } from '../firebaseConfig'; // Import your Firebase config
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';

// Define the Vehicle type
interface Vehicle {
  id: string;
  vehicleName: string;
  initialOdometer: number;
  nextOilChange: number;
  estimatedMiles: number;
  image: string;
}

const VehicleList = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingVehicleId, setTrackingVehicleId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehicleCollection = collection(db, 'vehicles');
        const vehicleSnapshot = await getDocs(vehicleCollection);
        const vehicleList = vehicleSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Vehicle[];

        setVehicles(vehicleList);
      } catch (error) {
        console.error('Error fetching vehicles: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleVehicleSelect = async (vehicle: Vehicle) => {
    if (trackingVehicleId === vehicle.id) {
      // Stop tracking
      setTrackingVehicleId(null);
      // Update Firebase with new estimated miles
      const vehicleRef = doc(db, 'vehicles', vehicle.id);
      await updateDoc(vehicleRef, { estimatedMiles: vehicle.estimatedMiles });
    } else {
      // Start tracking
      setTrackingVehicleId(vehicle.id);
      // Increment estimated miles locally
      vehicle.estimatedMiles += 1; // Increment by 1 for demonstration; adjust as needed
    }
  };

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity onPress={() => handleVehicleSelect(item)} style={styles.tile}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.vehicleName}>{item.vehicleName}</Text>
        <Text>Odometer: {item.initialOdometer} miles</Text>
        <Text>Miles to Next Service: {item.nextOilChange - (item.estimatedMiles + item.initialOdometer)} miles</Text>
        {trackingVehicleId === item.id && (
          <Ionicons name="checkmark-circle" size={20} color="green" style={styles.trackingIcon} />
        )}
      </View>
      {((item.nextOilChange - (item.estimatedMiles + item.initialOdometer)) < 0) && <View style={styles.notificationBubble} />}
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <FlatList
      data={vehicles}
      renderItem={renderVehicleItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      style={styles.flatList}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  flatList: {
    flex: 1,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    width: '100%', // Make the tile fill the screen horizontally
    minWidth: 400, // Set a minimum width for the tile
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  vehicleName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  trackingIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  notificationBubble: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10, // Make it circular
    backgroundColor: 'red', // Color of the notification bubble
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VehicleList; 