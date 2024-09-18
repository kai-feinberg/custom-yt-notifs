"use client";
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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

const googleProvider = new GoogleAuthProvider(); 

export const signInWithGoogle = async () => {
  try {
    const response = await signInWithPopup(auth, googleProvider);
    console.log('response:', response);
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
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
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
