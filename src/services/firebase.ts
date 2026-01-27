import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB-koNMj6-tZX0GB9foybyJStb0a5IntAg",
  authDomain: "restaurant-app-abf43.firebaseapp.com",
  projectId: "restaurant-app-abf43",
  storageBucket: "restaurant-app-abf43.firebasestorage.app",
  messagingSenderId: "170517408703",
  appId: "1:170517408703:web:99a71f5a026d2842508f0a",
  measurementId: "G-DW2N3X43LF"
};
  
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);export const db = getFirestore(app);