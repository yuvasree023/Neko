import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  isFirebaseConfigured,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  FirebaseUser,
} from '../services/firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isDemo?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  idToken: string | null;
  isDemoMode: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  loginAsDemo: (name?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = 'momo_demo_user_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check for active demo user in localStorage first
    const savedDemo = localStorage.getItem(DEMO_USER_KEY);
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setUser(parsed);
        setIdToken(`demo-user-token-${parsed.uid}`);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem(DEMO_USER_KEY);
      }
    }

    // 2. Check Firebase Auth if configured
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Journaler',
            photoURL: firebaseUser.photoURL,
            isDemo: false,
          });
          setIdToken(token);
        } else {
          setUser(null);
          setIdToken(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Default to demo user if not logged in
      const defaultDemoUser: UserProfile = {
        uid: 'demo-user-alex',
        email: 'alex@momojournal.local',
        displayName: 'Alex',
        photoURL: null,
        isDemo: true,
      };
      setUser(defaultDemoUser);
      setIdToken(`demo-user-token-${defaultDemoUser.uid}`);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(defaultDemoUser));
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    if (isFirebaseConfigured && auth) {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.removeItem(DEMO_USER_KEY);
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        isDemo: false,
      });
      setIdToken(token);
    } else {
      loginAsDemo('Google Demo User');
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const token = await result.user.getIdToken();
      localStorage.removeItem(DEMO_USER_KEY);
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || email.split('@')[0],
        photoURL: result.user.photoURL,
        isDemo: false,
      });
      setIdToken(token);
    } else {
      const name = email.split('@')[0];
      loginAsDemo(name.charAt(0).toUpperCase() + name.slice(1));
    }
  };

  const signupWithEmail = async (email: string, pass: string, name?: string) => {
    if (isFirebaseConfigured && auth) {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const token = await result.user.getIdToken();
      localStorage.removeItem(DEMO_USER_KEY);
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: name || email.split('@')[0],
        photoURL: null,
        isDemo: false,
      });
      setIdToken(token);
    } else {
      loginAsDemo(name || email.split('@')[0]);
    }
  };

  const loginAsDemo = (name = 'Alex') => {
    const demoUser: UserProfile = {
      uid: `demo-${name.toLowerCase().replace(/\s+/g, '-')}`,
      email: `${name.toLowerCase()}@momojournal.local`,
      displayName: name,
      photoURL: null,
      isDemo: true,
    };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    setIdToken(`demo-user-token-${demoUser.uid}`);
  };

  const logout = async () => {
    localStorage.removeItem(DEMO_USER_KEY);
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setUser(null);
    setIdToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        idToken,
        isDemoMode: Boolean(user?.isDemo || !isFirebaseConfigured),
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
