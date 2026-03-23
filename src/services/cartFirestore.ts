import {
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    setDoc,
    updateDoc
} from "firebase/firestore";
import { CartItem } from "../store/cartSlice";
import { db } from "./firebase";

export interface CartData {
  items: CartItem[];
  userId: string;
  lastUpdated: any;
  totalAmount: number;
}

/**
 * Save cart to Firestore for persistence
 */
export const saveCartToFirestore = async (userId: string, items: CartItem[]): Promise<void> => {
  try {
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const cartData: CartData = {
      items,
      userId,
      lastUpdated: serverTimestamp(),
      totalAmount,
    };

    const cartDoc = doc(db, "carts", userId);
    await setDoc(cartDoc, cartData);
    
    console.log("✅ Cart saved to Firestore:", { userId, itemCount: items.length, totalAmount });
  } catch (error) {
    console.error("❌ Error saving cart to Firestore:", error);
    throw error;
  }
};

/**
 * Load cart from Firestore
 */
export const loadCartFromFirestore = async (userId: string): Promise<CartItem[]> => {
  try {
    const cartDoc = doc(db, "carts", userId);
    const snapshot = await getDoc(cartDoc);

    if (snapshot.exists()) {
      const data = snapshot.data() as CartData;
      console.log("✅ Cart loaded from Firestore:", { userId, itemCount: data.items.length });
      return data.items || [];
    }
    
    console.log("ℹ️ No cart found for user:", userId);
    return [];
  } catch (error) {
    console.error("❌ Error loading cart from Firestore:", error);
    return [];
  }
};

/**
 * Update cart in Firestore (more efficient than full save)
 */
export const updateCartInFirestore = async (userId: string, items: CartItem[]): Promise<void> => {
  try {
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const cartData: Partial<CartData> = {
      items,
      lastUpdated: serverTimestamp(),
      totalAmount,
    };

    const cartDoc = doc(db, "carts", userId);
    await updateDoc(cartDoc, cartData);
    
    console.log("✅ Cart updated in Firestore:", { userId, itemCount: items.length, totalAmount });
  } catch (error) {
    console.error("❌ Error updating cart in Firestore:", error);
    throw error;
  }
};

/**
 * Clear cart from Firestore
 */
export const deleteCartFromFirestore = async (userId: string): Promise<void> => {
  try {
    const cartDoc = doc(db, "carts", userId);
    await deleteDoc(cartDoc);
    
    console.log("✅ Cart cleared from Firestore:", userId);
  } catch (error) {
    console.error("❌ Error clearing cart from Firestore:", error);
    throw error;
  }
};

/**
 * Real-time cart sync listener
 */
export const subscribeToCart = (userId: string, callback: (items: CartItem[]) => void) => {
  const cartDoc = doc(db, "carts", userId);
  
  const unsubscribe = onSnapshot(cartDoc, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data() as CartData;
      callback(data.items || []);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error("❌ Cart subscription error:", error);
    callback([]);
  });

  return unsubscribe;
};

/**
 * Merge local cart with Firestore cart (handles conflicts)
 */
export const mergeCarts = async (userId: string, localItems: CartItem[]): Promise<CartItem[]> => {
  try {
    const firestoreItems = await loadCartFromFirestore(userId);
    
    // Create a map of Firestore items by ID
    const firestoreItemsMap = new Map<string, CartItem>();
    firestoreItems.forEach(item => {
      firestoreItemsMap.set(item.id, item);
    });
    
    // Create a map of local items by ID
    const localItemsMap = new Map<string, CartItem>();
    localItems.forEach(item => {
      localItemsMap.set(item.id, item);
    });
    
    // Merge logic: Keep the higher quantity for each item
    const mergedItems: CartItem[] = [];
    const allItemIds = new Set([...firestoreItemsMap.keys(), ...localItemsMap.keys()]);
    
    allItemIds.forEach(itemId => {
      const firestoreItem = firestoreItemsMap.get(itemId);
      const localItem = localItemsMap.get(itemId);
      
      if (firestoreItem && localItem) {
        // Item exists in both, keep higher quantity
        const mergedItem = {
          ...localItem,
          quantity: Math.max(firestoreItem.quantity, localItem.quantity),
        };
        mergedItems.push(mergedItem);
      } else if (localItem) {
        // Item only exists locally
        mergedItems.push(localItem);
      } else if (firestoreItem) {
        // Item only exists in Firestore
        mergedItems.push(firestoreItem);
      }
    });
    
    console.log("🔄 Carts merged:", { 
      localCount: localItems.length, 
      firestoreCount: firestoreItems.length, 
      mergedCount: mergedItems.length 
    });
    
    return mergedItems;
  } catch (error) {
    console.error("❌ Error merging carts:", error);
    return localItems; // Fallback to local items
  }
};

// Legacy exports for backward compatibility
export const getCartFromFirestore = loadCartFromFirestore;
