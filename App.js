import './global.css';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import * as ReactNative from 'react-native';
if (!ReactNative.ViewPropTypes) {
  ReactNative.ViewPropTypes = ViewPropTypes;
}

// Polyfill Alert.alert cho nền tảng Web vì react-native-web mặc định Alert.alert là hàm rỗng (static alert() {})
if (ReactNative.Platform.OS === 'web' && ReactNative.Alert) {
  ReactNative.Alert.alert = (title, message, buttons) => {
    const text = [title, message].filter(Boolean).join('\n\n');
    if (!buttons || buttons.length === 0) {
      window.alert(text);
      return;
    }
    if (buttons.length === 1) {
      window.alert(text);
      buttons[0]?.onPress?.();
      return;
    }
    const confirmed = window.confirm(text);
    if (confirmed) {
      const confirmButton =
        buttons.find((b) => b.style !== 'cancel') || buttons[buttons.length - 1];
      confirmButton?.onPress?.();
    } else {
      const cancelButton = buttons.find((b) => b.style === 'cancel');
      cancelButton?.onPress?.();
    }
  };
}
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppProvider>
            <AppNavigator />
          </AppProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
