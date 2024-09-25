"use client";
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useUserStore } from '../app/store';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const getActiveUserUID = () => {
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  } else {
    console.log('No user is currently signed in.');
    return null;
  }
};

const googleProvider = new GoogleAuthProvider(); 

export const signInWithGoogle = async () => {
  try {
    const response = await signInWithPopup(auth, googleProvider);
    console.log('response:', response);
    
    // Get the Zustand store actions
    const { setUser, setLoggedIn } = useUserStore.getState();
    
    // Set the user UID and login status in the store
    setUser(response.user.uid);
    setLoggedIn(true);
    
    return response;
  } catch (error) {
    console.error('An error occurred while signing in with Google', error);
    return null;
  }
};

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const messaging = getMessaging(app);
      // Register the service worker
      const token = await getToken(messaging, { 
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration 
      });
      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while requesting permission ', error);
    return null;
  }
};

export const storeFCMToken = async (userId, fcmToken) => {
  console.log('userId:', userId);
  console.log('fcmToken:', fcmToken);
  try {
    const response = await fetch('/api/storeFCMToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, fcmToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to store FCM token');
    }

    console.log('FCM token stored successfully');
  } catch (error) {
    console.error('Error storing FCM token:', error);
  }
};

export { app };

export const onMessageListener = () =>
  new Promise((resolve) => {
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

// Add a new function to handle sign out
export const signOut = async () => {
  try {
    await auth.signOut();
    
    // Get the Zustand store actions
    const { setUser, setLoggedIn } = useUserStore.getState();
    
    // Clear the user UID and set login status to false in the store
    setUser(null);
    setLoggedIn(false);
    
    console.log('User signed out successfully');
  } catch (error) {
    console.error('An error occurred while signing out', error);
  }
};

// Add a function to check the current auth state
export const checkAuthState = () => {
  const { setUser, setLoggedIn } = useUserStore.getState();
  
  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user.uid);
      setLoggedIn(true);
    } else {
      setUser(null);
      setLoggedIn(false);
    }
  });
};
