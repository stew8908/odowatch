import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import { auth } from './app/firebaseConfig'; // Import your Firebase auth
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => false,
  signOut: async () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }
  if(!value)
    console.error('WTF!');

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email: string, password: string) => {
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setSession(user.uid); // Store user ID or any relevant session info
            console.log('Signed in:', user);
            return true
          } catch (error) {
            console.error('Sign-in error:', error);
          }
          return false
        },
        signOut: async () => {
          try {
            await firebaseSignOut(auth);
            setSession(null);
            console.log('Signed out');
          } catch (error) {
            console.error('Sign-out error:', error);
          }
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
