export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  preferences?: UserPreferences;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  favoriteCuisines: string[];
  allergens: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  ingredients: string[];
  allergens: string[];
  dietaryInfo: DietaryInfo;
  isAvailable: boolean;
  preparationTime: number;
  spicyLevel?: number;
  customizations?: CustomizationOption[];
}

export interface DietaryInfo {
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isNutFree: boolean;
}

export interface CustomizationOption {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: CustomizationItem[];
}

export interface CustomizationItem {
  id: string;
  name: string;
  price: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedCustomizations?: SelectedCustomization[];
  specialInstructions?: string;
}

export interface SelectedCustomization {
  optionId: string;
  itemId: string;
  name: string;
  price: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryOption: DeliveryOption;
}

export interface DeliveryOption {
  id: string;
  name: string;
  time: string;
  fee: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryOption: DeliveryOption;
  paymentMethod: PaymentMethod;
  deliveryAddress: Address;
  orderDate: Date;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  specialInstructions?: string;
  trackingId?: string;
}

export interface OrderStatus {
  id: string;
  name: string;
  color: string;
  timestamp?: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'wallet';
  name: string;
  details?: string;
  isDefault?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  orderId: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  priceRange: string;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  address: Address;
  phone: string;
  hours: OpeningHours;
}

export interface OpeningHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system';
  isRead: boolean;
  timestamp: Date;
  data?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
