# KomEat - React Native Restaurant Ordering App 🍽️

A full-featured React Native restaurant application built with Expo, allowing users to browse food menus, customize orders, manage their profiles, and place orders with multiple payment options. Includes an admin dashboard for restaurant management.

## Features ✨

### User Features
- ✅ **User Authentication**
  - Email/Password registration and login
  - User profile management with full CRUD operations
  - Secure card details storage

- ✅ **Food Menu & Browsing**
  - Browse food items by categories (Appetizers, Main Course, Desserts, Beverages)
  - View detailed food item information
  - Search and filter functionality

- ✅ **Order Customization**
  - Select sides (up to 2 options)
  - Choose drink options with pricing
  - Add extras with additional charges
  - Special instructions for each item
  - Quantity selection

- ✅ **Shopping Cart**
  - Add/remove items from cart
  - Edit quantities
  - Edit customizations for items
  - Clear entire cart
  - Real-time price calculation

- ✅ **Checkout & Order Placement**
  - Multiple delivery options (Pickup/Delivery)
  - Delivery address management
  - Multiple payment methods:
    - Credit/Debit Card (Stripe integration)
    - PayPal
    - Digital Wallet
    - Cash on Delivery
  - Tax calculation
  - Order confirmation

- ✅ **User Profile**
  - View and edit personal information
  - Update address details
  - Manage card information
  - Logout functionality

### Admin Features
- ✅ **Dashboard Overview**
  - Key statistics (Total Orders, Revenue, Pending Orders, Delivered Orders)
  - Quick access to menu and order management
  - Restaurant performance metrics

- ✅ **Order Management**
  - View all orders with status tracking
  - Filter orders by status (Pending, Confirmed, Preparing, Ready, Delivered)
  - Update order status
  - View customer details and order history

- ✅ **Menu Management**
  - Add new food items
  - Edit existing items
  - Delete items
  - Manage item availability

- ✅ **Analytics Dashboard**
  - Order trends visualization
  - Revenue distribution charts
  - Top-selling items list
  - Export reports functionality

## Project Structure 📁

```
Restaurant-App/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── user/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── ViewItemScreen.tsx
│   │   │   ├── CartScreen.tsx
│   │   │   ├── CheckoutScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── OrdersScreen.tsx
│   │   └── admin/
│   │       ├── AdminDashboardScreen.tsx
│   │       ├── ManageFoodScreen.tsx
│   │       └── OrdersScreen.tsx
│   ├── components/
│   │   ├── CartItem.tsx
│   │   ├── CategoryTabs.tsx
│   │   ├── FoodCard.tsx
│   │   └── QuantitySelector.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── AdminNavigator.tsx
│   ├── store/
│   │   ├── authSlice.ts
│   │   ├── cartSlice.ts
│   │   ├── foodSlice.ts
│   │   ├── ordersSlice.ts
│   │   └── store.ts
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── payment.ts
│   │   └── order.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useCart.ts
│   ├── constants/
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── formatters.ts
│       ├── helpers.ts
│       └── validators.ts
├── App.tsx
├── app.json
├── package.json
└── tsconfig.json
```

## Tech Stack 🛠️

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **UI Components**: React Native Elements
- **Backend**: Firebase (can be integrated)
- **Payment**: Stripe & PayPal (mock integration)
- **Styling**: React Native StyleSheet

## Installation & Setup 🚀

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Restaurant-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/emulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Or scan QR code with Expo Go app

## Configuration ⚙️

### Firebase Setup
To integrate real Firebase:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Update `src/config/firebase.ts` with your credentials:
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
   };
   ```

### Payment Integration

#### Stripe Setup
1. Get API keys from [stripe.com](https://stripe.com)
2. Update `src/services/payment.ts`:
   ```typescript
   stripePublicKey: 'your_public_key_here',
   stripeSecretKey: 'your_secret_key_here',
   ```

#### PayPal Setup
1. Get credentials from [paypal.com/developer](https://developer.paypal.com)
2. Update `src/services/payment.ts`:
   ```typescript
   paypalClientId: 'your_client_id_here',
   paypalSecret: 'your_secret_here',
   ```

## Available Scripts 📜

```bash
# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Run linting
npm run lint

# Reset project
npm run reset-project
```

## API Endpoints 🔌

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Food Items
- `GET /api/foods` - Get all food items
- `GET /api/foods/:id` - Get food item details
- `GET /api/foods/category/:category` - Get items by category
- `POST /api/foods` - Create food item (admin)
- `PUT /api/foods/:id` - Update food item (admin)
- `DELETE /api/foods/:id` - Delete food item (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/user/:userId` - Get user orders
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)
- `DELETE /api/orders/:id` - Cancel order

### Payment
- `POST /api/payments/stripe/intent` - Create Stripe payment intent
- `POST /api/payments/stripe/confirm` - Confirm Stripe payment
- `POST /api/payments/paypal/create` - Create PayPal payment
- `POST /api/payments/paypal/execute` - Execute PayPal payment

## Key Screens 📱

### Authentication Screens
- **LoginScreen**: Email/password login
- **RegisterScreen**: Full registration with address and card details

### User Screens
- **HomeScreen**: Browse food by categories
- **ViewItemScreen**: Detailed item view with customization options
- **CartScreen**: Review and edit cart items
- **CheckoutScreen**: Final order review and payment
- **ProfileScreen**: User profile management
- **OrdersScreen**: Order history and tracking

### Admin Screens
- **AdminDashboardScreen**: Overview, orders, menu, and analytics
- **ManageFoodScreen**: CRUD operations for menu items
- **OrdersScreen**: Admin order management

## Customization 🎨

### Colors
Edit `src/constants/index.ts`:
```typescript
export const COLORS = {
  primary: '#000000',
  secondary: '#FFFFFF',
  accent: '#333333',
  // ... more colors
};
```

### Categories
Edit `src/constants/index.ts` to add/modify categories:
```typescript
export const CATEGORIES = [
  { id: '1', name: 'Appetizers', icon: '🥗' },
  { id: '2', name: 'Main Course', icon: '🍽️' },
  // ... more categories
];
```

## Testing 🧪

### Test Credentials
- **User Account**:
  - Email: `user@example.com`
  - Password: `user123`

- **Admin Account**:
  - Email: `admin@example.com`
  - Password: `admin123`

### Test Card Numbers (Stripe)
- **Valid**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`

### Test PayPal
- Use sandbox credentials from [developer.paypal.com](https://developer.paypal.com)

## Performance Optimization 🚀

- Memoized components with `React.memo`
- Optimized FlatList rendering
- Lazy loading for images
- Redux for state management efficiency
- Code splitting with React Navigation

## Security Best Practices 🔒

- Never commit sensitive credentials
- Use environment variables for API keys
- Validate user input on frontend and backend
- HTTPS for API communications
- Secure card data with tokenization (Stripe/PayPal)
- User authentication on protected routes

## Troubleshooting 🐛

### Common Issues

1. **Metro bundler issues**
   ```bash
   npm start -- --reset-cache
   ```

2. **Module not found**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Emulator not starting**
   ```bash
   expo start -c
   ```

## Future Enhancements 🔮

- [ ] Real-time order tracking with maps
- [ ] Push notifications for orders
- [ ] User reviews and ratings
- [ ] Loyalty program and rewards
- [ ] Multiple restaurant support
- [ ] Scheduled orders
- [ ] Order history analytics
- [ ] Social sharing features
- [ ] In-app chat support
- [ ] OCR for receipt scanning

## Contributing 🤝

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Support 💬

For support, email support@komeat.app or create an issue in the repository.

## Acknowledgments 👏

- React Native team
- Expo team
- Redux team
- React Navigation team
- All contributors

---

**Made with ❤️ by the KomEat Team**

