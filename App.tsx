import React from 'react';
import { StatusBar, Text, useColorScheme, View} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Root from './src/container/root';
// import { View } from 'react-native/types_generated/index';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Root />
   
    </SafeAreaProvider>
  );
}

export default App;
