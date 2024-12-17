import { useState } from 'react';
import { TextInput, Button, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '../ctx';

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 5 }}>Email:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, width: '80%', padding: 10 }}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={{ marginBottom: 5 }}>Password:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, width: '80%', padding: 10 }}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Sign In"
        onPress={async () => {
          try {
            await signIn(email, password);
            console.info('Logged in successfully');
            router.replace('/(tabs)/home'); // Navigate to home after successful sign-in
          } catch (error) {
            console.error('Sign-in failed:', error);
            // Handle sign-in error (e.g., show an error message)
          }
        }}
      />
    </View>
  );
}
