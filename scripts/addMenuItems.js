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

// Menu items to add
const menuItems = [
  {
    name: "Buffalo Wings",
    category: "Starters",
    price: 89.99,
    description: "Spicy and crispy buffalo wings served with ranch dip",
    image: "Buffalo wing.jpg",
    popular: true,
    new: false
  },
  {
    name: "Cheesecake",
    category: "Desserts",
    price: 65.99,
    description: "Classic New York style cheesecake with berry compote",
    image: "Cheesecake.jpg",
    popular: false,
    new: false
  },
  {
    name: "Chocolate Birthday Cake",
    category: "Desserts",
    price: 189.99,
    description: "Decadent chocolate cake perfect for celebrations",
    image: "chocolate-birthday-cake-scaled.jpg",
    popular: true,
    new: false
  },
  {
    name: "Classic Burger",
    category: "Main Courses",
    price: 125.99,
    description: "Juicy beef patty with lettuce, tomato, and our special sauce",
    image: "ClassicBurgers.jpg",
    popular: true,
    new: false
  },
  {
    name: "Coca-Cola",
    category: "Beverages",
    price: 25.99,
    description: "Refreshing original Coca-Cola",
    image: "coke.webp",
    popular: false,
    new: false
  },
  {
    name: "Garlic Bread",
    category: "Starters",
    price: 45.99,
    description: "Toasted garlic bread with herbs and melted butter",
    image: "Garlic-Bread-4.webp",
    popular: false,
    new: false
  },
  {
    name: "Grilled Salmon",
    category: "Main Courses",
    price: 185.99,
    description: "Fresh Atlantic salmon grilled to perfection with lemon butter",
    image: "grilled-salmon-recipe.jpg",
    popular: true,
    new: true
  },
  {
    name: "Iced Coffee",
    category: "Beverages",
    price: 35.99,
    description: "Cold brewed coffee with milk and ice",
    image: "Iced-Coffee.jpg",
    popular: false,
    new: false
  },
  {
    name: "Pizza Margherita",
    category: "Main Courses",
    price: 155.99,
    description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil",
    image: "Pizza-Margherita.jpg",
    popular: true,
    new: false
  },
  {
    name: "Orange Juice",
    category: "Beverages",
    price: 30.99,
    description: "Fresh squeezed orange juice",
    image: "orange-juice.png",
    popular: false,
    new: false
  }
];

// Function to add menu items to Firebase
async function addMenuItems() {
  try {
    console.log('Starting to add menu items to Firebase...');
    
    for (const item of menuItems) {
      const docRef = await addDoc(collection(db, 'menu'), {
        ...item,
        createdAt: new Date()
      });
      
      console.log(`✅ Added: ${item.name} (ID: ${docRef.id})`);
    }
    
    console.log('🎉 All menu items added successfully!');
  } catch (error) {
    console.error('❌ Error adding menu items:', error);
  }
}

// Run the function
addMenuItems();
