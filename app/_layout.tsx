import { Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store } from '../src/store';

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)';
    
    if (isAuthenticated && !inAuthGroup) {
      // If authenticated and not in tabs, redirect to home
      // This will be handled by the individual screens
    } else if (!isAuthenticated && inAuthGroup) {
      // If not authenticated and in tabs, redirect to login
      // This will be handled by the individual screens
    }
  }, [isAuthenticated, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthWrapper>
        <>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" options={{ title: "Login" }} />
            <Stack.Screen name="register" options={{ title: "Register" }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </>
      </AuthWrapper>
    </Provider>
  );
}
