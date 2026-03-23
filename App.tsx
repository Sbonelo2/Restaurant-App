import { ExpoRoot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { COLORS } from './src/constants';
import { store } from './src/store';

// Must be exported from App.js
export default function App() {
  return (
    <Provider store={store}>
      <ExpoRoot context={require.context('./app')} />
      <StatusBar 
        style="light" 
        backgroundColor={COLORS.primary}
        translucent={false}
      />
    </Provider>
  );
}
