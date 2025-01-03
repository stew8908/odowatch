import { Stack } from "expo-router";

export default function RootLayout() {
    console.info("reached root")
  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="landing" options={{ headerShown: false }} />
        <Stack.Screen name="login" />
        {/* <Stack.Screen name="register" options={{ presentation: "modal" }} /> */}
      </Stack>
  );
}
