import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, Alert, Text } from 'react-native';
import * as Location from 'expo-location';
import { db, auth } from '../firebaseConfig'; // Import your Firebase config
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import VehicleList from '../components/VehicleList';
import { Vehicle } from '../types/Vehicle'; // Import the Vehicle interface
import { LocationSubscription } from 'expo-location'; // Import LocationSubscription
import VehicleDisplay from '../components/VehicleDisplay'; // Import the new component


const Home = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingVehicleId, setTrackingVehicleId] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [lastLocation, setLastLocation] = useState<Location.LocationObject | null>(null);
  const [watchingLocation, setWatchingLocation] = useState(false);
  const watchId = useRef<LocationSubscription | null>(null); // Update type here
  const [displayVehicleId, setDisplayVehicleId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehicleCollection = collection(db, 'vehicles');
        const vehicleSnapshot = await getDocs(vehicleCollection);
        const vehicleList = vehicleSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Vehicle[];

        // Filter the vehicle list to include only vehicles owned by the current user
        const currentUserId = auth.currentUser?.uid; // Get the current user's ID
        const ownedVehicleList = vehicleList.filter(vehicle => vehicle.ownerId === currentUserId);

        setVehicles(ownedVehicleList);
      } catch (error) {
        console.error('Error fetching vehicles: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [displayVehicleId]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setLastLocation(currentLocation);
      console.log('currentLocation new location:', currentLocation);
      console.log('Location is ready to go!');
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (trackingVehicleId && !watchingLocation) {
      startWatchingLocation();
    } else if (!trackingVehicleId && watchingLocation) {
      stopWatchingLocation();
    }
  }, [trackingVehicleId]);

  const startWatchingLocation = async () => {
    setWatchingLocation(true);
    watchId.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 0.1, 
        timeInterval: 1000,
      },
      (newLocation) => {
        console.log('Received new location:', newLocation);

        if (lastLocation) {
          const distance = calculateDistance(
            lastLocation.coords.latitude,
            lastLocation.coords.longitude,
            newLocation.coords.latitude,
            newLocation.coords.longitude
          );

          console.log('Distance traveled since last location:', distance);

          if (distance > 0) {
            // Update estimated miles for the tracked vehicle
            const updatedVehicles = vehicles.map(vehicle => {
              if (vehicle.id === trackingVehicleId) {
                const newEstimatedMiles = Math.round((vehicle.estimatedMiles + distance) * 4) / 4; // Round to nearest 0.25 miles
                console.log(`Updating estimated miles for vehicle ${vehicle.id}: ${newEstimatedMiles}`);
                return { ...vehicle, estimatedMiles: newEstimatedMiles };
              }
              return vehicle;
            });
            setVehicles(updatedVehicles);
          }
        }
        console.log('Last new location:', lastLocation);
        setLastLocation(newLocation);
        
      }
    );
  };

  const stopWatchingLocation = () => {
    if (watchId.current) {
      watchId.current.remove();
      watchId.current = null;
    }
    setWatchingLocation(false);
    console.log('Stopping tracking');
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 0.621371; // Distance in miles
  };

//   const handletrcking = async = async (vehicle: Vehicle) => {
// {
//   if (trackingVehicleId === vehicle.id) {
//     // Stop tracking
//     setTrackingVehicleId(null);
//     // Update Firebase with new estimated miles
//     const vehicleRef = doc(db, 'vehicles', vehicle.id);
//     await updateDoc(vehicleRef, { estimatedMiles: vehicle.estimatedMiles });
//   } else {
//     // Start tracking
//     setTrackingVehicleId(vehicle.id);
//     // Increment estimated miles locally
//     vehicle.estimatedMiles += 1; // Increment by 1 for demonstration; adjust as needed
//   }
// }

  const handleVehicleSelect = async (vehicle: Vehicle) => {
      setDisplayVehicleId(vehicle.id);
  };

  const onVehicleDeselect = async () => {
    setDisplayVehicleId(null);
};


  const calculateServiceDue = (vehicle: Vehicle): boolean => {
    const totalMiles = vehicle.initialOdometer + vehicle.estimatedMiles;
    return totalMiles >= vehicle.nextOilChange;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ flex: 1 }}>
      {displayVehicleId ? (
         <VehicleDisplay 
         vehicles={vehicles.map(vehicle => ({
           ...vehicle
         }))} 
         displayVehicleId={displayVehicleId} 
         onVehicleDeselect={onVehicleDeselect}
       />
      ) : (
        <VehicleList 
          vehicles={vehicles.map(vehicle => ({
            ...vehicle,
            serviceDue: calculateServiceDue(vehicle), // Calculate serviceDue dynamically
          }))} 
          trackingVehicleId={trackingVehicleId} 
          onVehicleSelect={handleVehicleSelect} 
        />
      )}
      {location && (
        <View>
          <Text>Current Location: {location.coords.latitude}, {location.coords.longitude}</Text>
        </View>
      )}
    </View>
  );
};

export default Home;