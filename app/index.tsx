import { Text, View, Alert } from "react-native";
import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import Constants from 'expo-constants';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export default function Index() {
  const [distance, setDistance] = useState(0);
  const [lastLocation, setLastLocation] = useState<Location.LocationObject | null>(null);
  const isExpoGo = Constants.appOwnership === 'expo';

  useEffect(() => {
    const setupLocation = async () => {
      try {
        console.info('[Location] Requesting permissions');
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          console.error('[Location] Permission denied');
          Alert.alert("Permission to access location was denied");
          return;
        }

        console.info('[Location] Starting location tracking');
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 5000,
            distanceInterval: 5,
          },
          (location) => {
            console.info('[Location] New location received:', location);
            if (lastLocation) {
              const newDistance = calculateDistance(
                lastLocation.coords.latitude,
                lastLocation.coords.longitude,
                location.coords.latitude,
                location.coords.longitude
              );
              console.info('[Location] Distance update:', { added: newDistance });
              setDistance(d => d + newDistance);
            }
            setLastLocation(location);
          }
        );

        return () => {
          console.info('[Location] Cleaning up subscription');
          subscription.remove();
        };
      } catch (error) {
        console.error('[Location] Setup error:', error);
      }
    };

    setupLocation();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Distance Traveled:</Text>
      <Text>{(distance / 1000).toFixed(2)} km</Text>
      
      {lastLocation && (
        <>
          <Text style={{ marginTop: 20 }}>Current Position:</Text>
          <Text>Lat: {lastLocation.coords.latitude.toFixed(6)}</Text>
          <Text>Long: {lastLocation.coords.longitude.toFixed(6)}</Text>
        </>
      )}

      {isExpoGo && (
        <Text style={{ color: 'gray', marginTop: 10 }}>
          Running in Expo Go (foreground only)
        </Text>
      )}
    </View>
  );
}
