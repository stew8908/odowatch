import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Vehicle } from '../types/Vehicle'; // Import the Vehicle interface

interface VehicleListProps {
  vehicles: Vehicle[];
  trackingVehicleId: string | null;
  onVehicleSelect: (vehicle: Vehicle) => void;
}
const calculateServiceDue = (vehicle: Vehicle): boolean => {
    const totalMiles = vehicle.initialOdometer + vehicle.estimatedMiles;
    return totalMiles >= vehicle.nextOilChange;
  };

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, trackingVehicleId, onVehicleSelect }) => {
  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity 
      onPress={() => onVehicleSelect(item)} 
      onLongPress={() => {/* Navigate to edit page with item */}}
      style={styles.tile}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.vehicleName}>{item.vehicleName}</Text>
        <Text>Initial Odometer: {item.initialOdometer} miles</Text>
        <Text>Estimated Miles: {item.estimatedMiles} miles</Text>
        <Text>Next Oil Change: {item.nextOilChange} miles</Text>
        {trackingVehicleId === item.id && (
          <Ionicons name="checkmark-circle" size={20} color="green" style={styles.trackingIcon} />
        )}
        {calculateServiceDue(item) && <Text style={styles.serviceDueText}>Service Due!</Text>}
      </View>
    </TouchableOpacity>
  );

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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    width: '100%',
    minWidth: 400,
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
  serviceDueText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default VehicleList; 