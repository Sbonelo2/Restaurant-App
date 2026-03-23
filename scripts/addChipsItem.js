import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-koNMj6-tZX0GB9foybyJStb0a5IntAg",
  authDomain: "restaurant-app-abf43.firebaseapp.com",
  projectId: "restaurant-app-abf43",
  storageBucket: "restaurant-app-abf43.firebasestorage.app",
  messagingSenderId: "170517408703",
  appId: "1:170517408703:web:99a71f5a026d2842508f0a",
  measurementId: "G-DW2N3X43LF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Add chips menu item
const chipsItem = {
  name: "French Fries",
  category: "Starters",
  price: 35.99,
  description: "Crispy golden French fries with salt and ketchup",
  image: "picpasta .webp", // Using available image as placeholder
  popular: true,
  new: false
};

// Function to add chips item to Firebase
async function addChipsItem() {
  try {
    console.log('Adding French Fries to Firebase...');
    
    const docRef = await addDoc(collection(db, 'menu'), {
      ...chipsItem,
      createdAt: new Date()
    });
    
    console.log(`✅ Added: French Fries (ID: ${docRef.id})`);
    console.log('🎉 French Fries added successfully!');
  } catch (error) {
    console.error('❌ Error adding French Fries:', error);
  }
}

// Run the function
addChipsItem();
