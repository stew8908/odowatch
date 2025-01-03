import { Button, StyleSheet, TextInput, Text, View } from "react-native";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from './firebaseConfig'; 
import { setDoc, doc } from 'firebase/firestore';
import { useState } from "react";
import { router } from "expo-router";

export default function RegisterScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const handleRegister = () => {
    createUserWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          updateProfile(user, {
            displayName: username,
          })
          .then(() => {
            setDoc(doc(db, "users", user.uid), {
              email: user.email,
              username: username,
              welcome_message_sent: false,
            })
            .then(() => {
              router.replace("/(tabs)");
            })
            .catch((error: any) => {
              console.error("Error creating user document: ", error);
            });
          })
          .catch((error: any) => {
            console.error("Error updating user profile: ", error);
          });
        }
      })
      .catch((err) => {
        alert(err?.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Screen</Text>
      <Text>Username:</Text>
      <TextInput
        style={{ backgroundColor: "white", width: "80%", padding: 10 }}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
      />
      <Text>Email:</Text>
      <TextInput
        style={{ backgroundColor: "white", width: "80%", padding: 10 }}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
      />
      <Text>Password:</Text>
      <TextInput
        style={{ backgroundColor: "white", width: "80%", padding: 10 }}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <Button title={"Register"} onPress={handleRegister} />
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