import React from 'react';
import { View, Button, Text } from 'react-native';

const QuantitySelector: React.FC = () => {
  return (
    <View>
      <Button title="-" onPress={() => {}} />
      <Text>1</Text>
      <Button title="+" onPress={() => {}} />
    </View>
  );
};

export default QuantitySelector;
