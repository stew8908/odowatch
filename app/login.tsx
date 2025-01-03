import { Button, StyleSheet, TextInput, Text, View, TouchableOpacity } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { useState } from "react";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    signInWithEmailAndPassword(getAuth(), email, password)
      .then((user) => {
        if (user) router.replace("/(tabs)");
      })
      .catch((err) => {
        alert(err?.message);
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <Text>Email:</Text>
      <TextInput
        style={{ backgroundColor: "white", width: "80%", padding: 10 }}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
      />
      <Text>Password</Text>
      <TextInput
        style={{ backgroundColor: "white", width: "80%", padding: 10 }}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <Button title={"Login"} onPress={handleLogin} />
      
      <TouchableOpacity onPress={() => router.push("/resetpwd")}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
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
  forgotPassword: {
    marginTop: 15,
    color: "blue",
    textDecorationLine: "underline",
  },
});