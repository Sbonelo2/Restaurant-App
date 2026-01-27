# KomEat Setup & Deployment Guide

## System Requirements 📋

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (or yarn v1.22.0+)
- **Expo CLI**: Latest version
- **Mobile Device or Emulator**: iOS or Android

## Prerequisites Installation 🛠️

### 1. Install Node.js and npm
Download from [nodejs.org](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Expo CLI
```bash
npm install -g expo-cli
```

Verify installation:
```bash
expo --version
```

### 3. Install Android Studio or Xcode (Optional)
For local emulator testing:
- **Android**: Download [Android Studio](https://developer.android.com/studio)
- **iOS**: Install [Xcode](https://developer.apple.com/xcode/) from Mac App Store

## Project Setup 🚀

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Restaurant-App.git
cd Restaurant-App
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npx expo start
```

### 4. Run on Device/Emulator

**Option A: Expo Go (Easiest)**
- Download Expo Go app from App Store or Google Play
- Scan QR code from terminal

**Option B: Android Emulator**
```bash
npm run android
```

**Option C: iOS Simulator (Mac only)**
```bash
npm run ios
```

**Option D: Web Browser**
```bash
npm run web
```

## Environment Configuration ⚙️

### Firebase Configuration

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

2. Create `.env` file in root directory:
```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. Update `src/config/firebase.ts`:
```typescript
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
};
```

### Stripe Configuration

1. Sign up at [stripe.com](https://stripe.com)
2. Get your API keys from [Dashboard > API keys](https://dashboard.stripe.com/apikeys)
3. Update `src/services/payment.ts`:
```typescript
const paymentConfig: PaymentConfig = {
  stripePublicKey: process.env.EXPO_PUBLIC_STRIPE_PUBLIC_KEY,
  stripeSecretKey: process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY,
  // ... other configs
};
```

### PayPal Configuration

1. Sign up at [developer.paypal.com](https://developer.paypal.com)
2. Get your sandbox credentials
3. Update `src/services/payment.ts`:
```typescript
const paymentConfig: PaymentConfig = {
  paypalClientId: process.env.EXPO_PUBLIC_PAYPAL_CLIENT_ID,
  paypalSecret: process.env.EXPO_PUBLIC_PAYPAL_SECRET,
  // ... other configs
};
```

## Testing 🧪

### Test Accounts
- **User**: user@example.com / user123
- **Admin**: admin@example.com / admin123

### Test Payment Methods

**Stripe Test Cards:**
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- Auth Required: 4000 0025 0000 3155

**PayPal Sandbox:**
- Use sandbox credentials from Developer Dashboard

## Building for Production 📦

### Option 1: Expo Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Create EAS project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Option 2: Local Build (Android)

```bash
# Create APK
eas build --platform android --local

# Install on device
adb install app-release.apk
```

### Option 3: App Store/Google Play

1. Create developer accounts:
   - [Apple Developer](https://developer.apple.com/)
   - [Google Play Console](https://play.google.com/console/)

2. Configure signing:
```bash
eas credentials
```

3. Submit build:
```bash
eas submit --platform ios
eas submit --platform android
```

## Debugging 🐛

### Enable Debug Mode
```bash
npx expo start --dev-client
```

### View Logs
```bash
npx expo start --log-level=debug
```

### Remote Debugger
1. Press `j` in terminal during dev server
2. Open Chrome DevTools

### Device Logs
```bash
# Android
adb logcat

# iOS
xcrun simctl spawn booted log stream --predicate 'process == "Komeat"'
```

## Performance Optimization 📈

### Bundle Size Analysis
```bash
npm install -g source-map-explorer
source-map-explorer 'dist/**.js'
```

### Code Splitting
Enabled by default with React Navigation

### Image Optimization
- Use WebP format where possible
- Compress images before adding
- Use placeholder images during load

## Troubleshooting 🔧

### Issue: Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Metro bundler cache issue
```bash
npx expo start --reset-cache
```

### Issue: Port 8081 already in use
```bash
# Kill process on port 8081
lsof -i :8081
kill -9 <PID>

# Or use different port
npx expo start --port 3000
```

### Issue: Android build fails
```bash
# Clear Gradle cache
cd android && ./gradlew clean && cd ..

# Rebuild
npm run android
```

### Issue: iOS pod issues
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

## Security Checklist ✅

- [ ] Remove test credentials from production
- [ ] Use environment variables for API keys
- [ ] Enable HTTPS for all API calls
- [ ] Implement rate limiting
- [ ] Validate user input
- [ ] Use secure authentication
- [ ] Encrypt sensitive data
- [ ] Implement CORS properly
- [ ] Keep dependencies updated
- [ ] Use strong passwords

## Monitoring & Analytics 📊

### Setup Sentry (Error Tracking)
```bash
npm install @sentry/react-native
```

### Setup Firebase Analytics
```bash
# Already included in firebase.ts
```

### Setup Segment (Event Tracking)
```bash
npm install @segment/analytics-react-native
```

## Deployment Checklist 📋

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Production credentials configured
- [ ] Error tracking enabled
- [ ] Analytics enabled
- [ ] Performance monitoring enabled
- [ ] Security check completed
- [ ] Build tested on device
- [ ] App icons/splash screens configured
- [ ] Version number updated
- [ ] App Store/Play Store listings complete

## Support & Resources 💡

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Redux Docs](https://redux.js.org/)
- [React Navigation Docs](https://reactnavigation.org/)
- [Stripe Docs](https://stripe.com/docs)
- [PayPal Docs](https://developer.paypal.com/docs/)
- [Firebase Docs](https://firebase.google.com/docs)

## Contact & Support 📞

For issues and questions:
- GitHub Issues: [Create an Issue](https://github.com/yourusername/Restaurant-App/issues)
- Email: support@komeat.app
- Discord: [Join Community](https://discord.gg/yourinvite)

---

**Last Updated**: January 2026
**Maintained By**: Development Team
