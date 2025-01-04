import { router, Stack } from "expo-router";
import { Button, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function RootLayout() {
    console.info("reached rootr")
  return (
      <Stack>
        <Stack.Screen name="index" options={{ 
            headerShown: true,
            title: "",
            headerRight: () => (
              <TouchableOpacity onPress={() => router.push('/(home)/addvehicle')}>
                <Icon name="add" size={24} color="#000" />
              </TouchableOpacity>
            )
            }} />
        <Stack.Screen name="addvehicle" options={{title: "Add Vehicle"}} />
       <Stack.Screen name="findvehicle" options={{ title: "Find Vehicle" }} />
      </Stack>
  );
}

