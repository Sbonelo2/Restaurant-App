# 🚀 Getting Started - Restaurant App

## Quick Start (5 minutes)

### 1. Navigate to project
```bash
cd C:\Users\Trainee\Restaurant-App
```

### 2. Install dependencies (if not already done)
```bash
npm install
```

### 3. Start the app

#### Option A: Web (Recommended for quick testing)
```bash
npm start
# Select 'w' for web
# Opens browser at http://localhost:8081
```

#### Option B: iOS Simulator
```bash
npm run ios
# Requires Xcode and macOS
```

#### Option C: Android Emulator
```bash
npm run android
# Requires Android Studio and emulator running
```

#### Option D: Expo Go App (Phone)
```bash
npm start
# Scan QR code with Expo Go app on your phone
```

---

## 📋 Features Ready to Test

### 1. User Registration
1. Start the app
2. Click "Create Account" on login screen
3. Fill in all registration details:
   - Name, Surname
   - Email: test@example.com
   - Phone: 5551234567
   - Address: 123 Main St, New York, NY 10001
   - Password: Test123!
   - Card: 4242 4242 4242 4242 (Stripe test card)
4. Tap "Register"

### 2. Browse Menu
1. Login with test account
2. See food items by category
3. Tap category tabs to filter
4. See food cards with:
   - Images
   - Prices
   - Descriptions
   - Availability badges

### 3. Customize Items
1. Tap on any food item
2. Select customization options:
   - Choose up to 2 sides
   - Pick 1 drink
   - Add extras
3. Add special instructions
4. Adjust quantity
5. See real-time price updates
6. Tap "Add to Cart"

### 4. View Cart
1. Tap cart icon
2. See all items with customizations
3. Adjust quantities
4. Remove items
5. See total with tax

### 5. Checkout
1. Tap "Checkout"
2. Select delivery method:
   - Pickup (free)
   - Delivery ($2.99)
3. Enter address
4. Select payment method:
   - Card (4242 4242 4242 4242)
   - PayPal (test@paypal.com)
   - Wallet ($500 available)
   - Cash
5. Place order
6. See order confirmation

### 6. View Profile
1. Tap profile icon
2. View your information
3. Tap "Edit" to update
4. Update name, phone, address, or card
5. Tap "Save Changes"

### 7. Admin Dashboard (if logged in as admin)
1. Login with admin@example.com / admin123
2. See Overview tab with metrics
3. View Orders tab with order list
4. Manage Menu in Menu tab
5. See Analytics with charts

---

## 🧪 Test Data

### Credentials
```
Regular User:
  Email: user@example.com
  Password: user123

Admin User:
  Email: admin@example.com
  Password: admin123

Test User (from registration):
  Email: test@example.com
  Password: Test123!
```

### Payment Methods
```
Stripe Card (use for card payments):
  Number: 4242 4242 4242 4242
  Expiry: 12/25
  CVC: 123

PayPal (mock):
  Email: test@paypal.com
  Password: paypal123

Digital Wallet (mock):
  Balance: $500
  PIN: 1234

Cash:
  No payment needed (on delivery)
```

---

## 🔍 Verify Installation

```bash
# Check npm installation
npm --version

# Check Node.js installation
node --version

# Check project dependencies
npm ls

# Check TypeScript
npx tsc --version

# Verify project structure
ls -la src/

# Check git status
git status
```

---

## 📱 Expected App Screens

### Authentication Flow
```
Login Screen ↓
└─ Register Screen → Home Screen
```

### User Flow
```
Home Screen (Browse by Category)
    ├─ View Item Screen (Customize)
    ├─ Cart Screen
    ├─ Checkout Screen → Order Confirmation
    └─ Profile Screen
```

### Admin Flow
```
Admin Dashboard (4 Tabs)
├─ Overview (Sales metrics)
├─ Orders (Manage orders)
├─ Menu (Add/edit/delete items)
└─ Analytics (Reports & charts)
```

---

## 🛠 Development Commands

```bash
# Start development server
npm start

# Run linting
npm run lint

# Run tests (when configured)
npm test

# Build for production
npm run build

# Eject from Expo (not recommended)
npm run eject

# Clear cache
npm start -- --clear
```

---

## 🐛 Debugging

### Enable Redux DevTools
The app is configured for Redux DevTools browser extension. Install the extension and it will automatically connect.

### View Logs
```bash
# In terminal while app is running, press:
# 'i' to launch iOS simulator
# 'a' to launch Android emulator  
# 'w' to open web
# 'j' to open debugger
```

### Check Errors
Look at the console output for:
- Redux actions dispatching
- Navigation events
- API calls (mocked)
- State changes

---

## 📚 Documentation

See these files for more information:
- `README.md` - Full project documentation
- `SETUP.md` - Detailed setup instructions
- `IMPLEMENTATION.md` - Feature implementation summary
- `COMPLETION_STATUS.md` - Project completion status

---

## 🎯 Next Steps

1. **Run the app** to see it in action
2. **Test all features** using the credentials and test data provided
3. **Review the code** to understand the structure
4. **Integrate with real backend** when ready (see SETUP.md)
5. **Deploy to stores** when features are complete

---

## ❓ Troubleshooting

### Port Already in Use
```bash
# Kill the process
lsof -ti:8081 | xargs kill -9
```

### Dependencies Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
npx tsc --noEmit
```

### Clear Cache
```bash
npm start -- --clear
```

---

## 📞 Support

If you encounter issues:
1. Check the error message in the console
2. Review the SETUP.md file
3. Check the project structure is complete
4. Try clearing cache and reinstalling dependencies
5. Check Node.js and npm versions

---

**Happy coding! 🎉**
