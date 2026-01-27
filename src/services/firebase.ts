import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'YOUR_KEY',
  authDomain: 'YOUR_DOMAIN'
};

export const firebaseApp = initializeApp(firebaseConfig);
