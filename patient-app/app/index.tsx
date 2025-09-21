import { useAuthStore } from "@/store/authStore";
import { router, usePathname } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function IndexScreen() {
  const { user, isLoading, loadStoredAuth } = useAuthStore();
  const pathname = usePathname(); 
  useEffect(() => {
    loadStoredAuth();
  }, []);
  // Log the current route whenever it changes
  useEffect(() => {
    console.log('Current route:', pathname);
  }, [pathname]);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/(tabs)/doctors');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading]);
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563EB" />
      <Text style={styles.loadingText}>Loading Clinix Sphere...</Text>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
});