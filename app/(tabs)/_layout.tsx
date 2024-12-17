import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform, View, Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
    initialRouteName="home"
    screenOptions={{
      tabBarStyle:
        Platform.OS === "ios"
          && {
              backgroundColor: "white",
            },
       headerShown: false,
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