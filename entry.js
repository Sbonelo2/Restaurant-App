import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router/build/ExpoRoot';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from './src/constants';

function App() {
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

registerRootComponent(App);
