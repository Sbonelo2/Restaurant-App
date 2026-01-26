import { SafeAreaView, StyleSheet } from 'react-native';
import AppNavigator from '../src/navigation/AppNavigator';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <AppNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
