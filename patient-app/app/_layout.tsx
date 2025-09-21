import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2563EB',
    secondary: '#059669',
    tertiary: '#16A34A',
    surface: '#FFFFFF',
    surfaceVariant: '#F9FAFB',
    background: '#F9FAFB',
    error: '#DC2626',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#111827',
    onBackground: '#111827',
  },
};

export default function RootLayout() {
  useFrameworkReady();

  return (
    <PaperProvider theme={theme}>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </>
    </PaperProvider>
  );
}
