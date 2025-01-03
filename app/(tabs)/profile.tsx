import React from 'react';
import { View, Text } from 'react-native';
import { auth } from '../firebaseConfig';

const Profile = () => {
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome {auth.currentUser?.displayName}</Text>
      <Text
        onPress={async() => {
          console.info('Signing out')
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
            try
            { 
              await auth.signOut();
              console.info('Signed out')
            } 
            catch(error)
            {
              console.error(error)
            }
        }}>
        Sign Out
      </Text>
    </View>
  );
};

export default Profile; 


