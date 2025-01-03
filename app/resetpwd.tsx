import { Button, StyleSheet, TextInput, Text, View } from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { router } from "expo-router";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState<string>("");

  const handleResetPassword = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent! Check your inbox.");
        router.replace("/login"); // Navigate to the login screen after sending the email
      })
      .catch((error) => {
        alert(error?.message); // Show error message if any
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text>Email:</Text>
      <TextInput
        style={{ backgroundColor: "white", width: "80%", padding: 10 }}
        placeholder="Enter your email"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
      />
      <Button title={"Send Reset Email"} onPress={handleResetPassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});