import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { COLORS } from './src/constants';
import { store } from './src/store';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar 
          style="light" 
          backgroundColor={COLORS.primary}
          translucent={false}
        />
        <View style={styles.content}>
          {/* The main app content will be rendered by the Expo Router */}
          {/* This includes navigation, screens, and all app functionality */}
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
