import { FontAwesome } from "@expo/vector-icons";
import { Tabs, Redirect } from "expo-router";
import { BlurView } from "expo-blur";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform, View, Text } from "react-native";
import { useSession } from '../../ctx';
import { useEffect } from 'react';

export default function TabsLayout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  console.info('Checking Session:', session)
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }
  useEffect(() => {
    if (session) {
      console.log('Session updated:', session);
      // Perform any actions needed when the session changes, e.g., redirecting
      // For example, you could navigate to a different page or show a success message
    } else {
      console.log('User signed out or session cleared');
      // Handle the case when the user is signed out
    }
  }, [session]); 

  // This layout can be deferred because it's not the root layout.
  return (
    <Tabs
    initialRouteName="home"
    screenOptions={{
      tabBarStyle:
        Platform.OS === "ios"
          && {
              backgroundColor: "white",
            },
       headerShown: true,
    }}
    tabBar={(props) =>
      Platform.OS === "ios" ? (
        <BlurView
          style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
          intensity={95}
        >
          <BottomTabBar {...props} />
        </BlurView>
      ) : (
        <BottomTabBar {...props} />
      )
    }
  >
    <Tabs.Screen
      name="home"
      options={{
        href: "/home",
        title: "",
        tabBarIcon: ({ color }) => (
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginTop: 17,
              backgroundColor: "transparent",
            }}
          >
            <TabBarIcon name="car" color={color} size={24} />
            <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.5 }}>
              Home
            </Text>
          </View>
        ),
      }}
    />
        <Tabs.Screen
      name="addvehicle"
      options={{
        href: "/addvehicle",
        title: "",
        tabBarIcon: ({ color }) => (
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginTop: 17,
              backgroundColor: "transparent",
            }}
          >
            <TabBarIcon name="plus" color={color} size={24} />
            <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.5 }}>
            Add Vehicle
            </Text>
          </View>
        ),
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        title: "",
        headerShown: true,
        href: "/profile",
        tabBarIcon: ({ color }) => (
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginTop: 17,
              backgroundColor: "transparent",
            }}
          >
            <TabBarIcon name="user" color={color} size={24} />
            <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.5 }}>
              Account
            </Text>
          </View>
        ),
      }}
    />
  </Tabs>
);
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  size?: number;
}) {
  return (
    <FontAwesome
      size={props.size || 26}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}