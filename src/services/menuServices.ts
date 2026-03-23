import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  popular?: boolean; // Optional: true if item is popular
  new?: boolean; // Optional: true if item is new
  // You can add more fields here in the future
}

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const snapshot = await getDocs(collection(db, "menu"));

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<MenuItem, "id">;

    return {
      id: doc.id,
      name: data.name,
      category: data.category,
      price: data.price,
      description: data.description,
      image: data.image, // Just return the filename, getImageSource will handle the mapping
      popular: data.popular || false,
      new: data.new || false,
    };
  });
};
