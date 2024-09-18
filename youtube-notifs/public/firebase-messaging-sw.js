importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCO-hZqKQio3oEiCBbSVnBUpaJabZsB47M",
    authDomain: "custom-yt-notifs.firebaseapp.com",
    projectId: "custom-yt-notifs",
    storageBucket: "custom-yt-notifs.appspot.com",
    messagingSenderId: "889378702052",
    appId: "1:889378702052:web:e0b9ac7573e558463462f1",
    measurementId: "G-727RSKRM07",
    vapidKey: "BBrT2NdErzaszrcLqtQ7icX0J1y-irKEKqXZoRNMcA1M1Zihhl9QYl9XrkvqrNZMUHujXdDY5ohX8R2V39lsSE0",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/download.jpg',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
