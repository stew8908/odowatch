import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, PermissionsAndroid, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import useBLE from "./useBLE";
import { useRouter } from 'expo-router'; // Import useRouter for navigation

const FindVehicle = () => {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter(); // Initialize the router
  const {
    allDevices,
    requestPermissions,
    scanForPeripherals,
  } = useBLE();
  useEffect(() => {
    allDevices.forEach(device => {
      const rssiValue = device.rssi !== null ? device.rssi.toString() : '0'; // Convert to string or use '0' as fallback
      if (parseInt(rssiValue) > -50) {
        console.info(`Device Name: ${device.name || 'Unnamed'}, Device ID: ${device.id}, RSSI: ${device.rssi}, Manufacturer Data: ${device.manufacturerData}`);
      }
    });
    return () => {
      console.log("FindVehicle component unmounted");
      // Perform any additional cleanup if necessary
    };
  }, [allDevices]);

  const startScan  = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      console.info('Scan Complete');
      scanForPeripherals();
      console.info('Scan Complete');
      
    }
    else {
      console.info('Permissions not enabled');
    }
  };

  const handleSelect = (id: string) => {
    console.info(`Selected Device ID: ${id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Vehicle Identifier</Text>
      <Button title="Scan for Vehicles" onPress={startScan} />
      <FlatList
        data={allDevices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item.id)}>
            <Text>
              {item.name ? item.name : `Unnamed - ${item.id.split('-')[0]}`}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addVehicleButton: {
    marginTop: 15,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default FindVehicle;