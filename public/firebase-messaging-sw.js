importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDKSQjaw1EVELeglvuvn6AKmMWGttDFqLQ",
  authDomain: "village-65ca1.firebaseapp.com",
  projectId: "village-65ca1",
  storageBucket: "village-65ca1.firebasestorage.app",
  messagingSenderId: "827867233445",
  appId: "1:827867233445:web:cc9b9d0fca189ade85214c",
  measurementId: "G-NM8M0RP1XZ",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icons/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
