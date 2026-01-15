export const RESTAURANT_NAME = 'KomEat';
export const RESTAURANT_TAGLINE = 'Good Food, Fast Delivery';

export const CATEGORIES = [
  { id: '1', name: 'Appetizers', icon: '🥗' },
  { id: '2', name: 'Main Course', icon: '🍽️' },
  { id: '3', name: 'Desserts', icon: '🍰' },
  { id: '4', name: 'Beverages', icon: '🥤' },
];

export const DELIVERY_OPTIONS = [
  { id: 'pickup', name: 'Pickup', time: '15-20 min', fee: 0 },
  { id: 'delivery', name: 'Delivery', time: '30-45 min', fee: 2.99 },
];

export const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit/Debit Card', type: 'card' },
  { id: 'cash', name: 'Cash on Delivery', type: 'cash' },
  { id: 'wallet', name: 'Digital Wallet', type: 'wallet' },
];

export const ORDER_STATUSES = [
  { id: 'pending', name: 'Pending', color: '#666666' },
  { id: 'confirmed', name: 'Confirmed', color: '#000000' },
  { id: 'preparing', name: 'Preparing', color: '#333333' },
  { id: 'ready', name: 'Ready for Pickup', color: '#000000' },
  { id: 'delivered', name: 'Delivered', color: '#000000' },
  { id: 'cancelled', name: 'Cancelled', color: '#000000' },
];

export const COLORS = {
  primary: '#000000',
  secondary: '#FFFFFF',
  accent: '#333333',
  background: '#FFFFFF',
  text: '#000000',
  textLight: '#666666',
  success: '#000000',
  warning: '#333333',
  error: '#000000',
  border: '#E0E0E0',
};

export const SIZES = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
