import React from 'react';
import { View, Text } from 'react-native';

export default function TestScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>KomEat App</Text>
      <Text style={{ fontSize: 16, marginTop: 10 }}>App is working!</Text>
    </View>
  );
}
