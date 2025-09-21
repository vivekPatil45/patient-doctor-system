import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import {
  Text,
  Card,
  List,
  Avatar,
  Button,
  Dialog,
  Portal,
} from 'react-native-paper';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [dialogVisible, setDialogVisible] = React.useState(false);

  const handleLogout = () => setDialogVisible(true);

  const confirmLogout = async () => {
    setDialogVisible(false);
    await logout();
    router.replace('/login');
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text variant="bodyLarge">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Profile
        </Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.profileSection}>
          <Card.Content style={styles.profileContent}>
            {user?.image ? (
              <Avatar.Image size={80} source={{ uri: user.image }} style={styles.avatar} />
            ) : (
              <Avatar.Icon size={80} icon="account" style={styles.avatar} />
            )}
            <Text variant="headlineSmall" style={styles.name}>
              {user.name}
            </Text>
            <Text variant="bodyMedium" style={styles.role}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.infoSection}>
          <List.Item
            title="Email"
            description={user.email}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
        </Card>

        <Card style={styles.actions}>
          <List.Item
            title="Settings"
            left={(props) => <List.Icon {...props} icon="cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Logout"
            titleStyle={styles.logoutText}
            left={(props) => <List.Icon {...props} icon="logout" color="#DC2626" />}
            onPress={handleLogout}
          />
        </Card>
      </View>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Logout</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Are you sure you want to logout?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmLogout} textColor="#DC2626">Logout</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    backgroundColor: '#2563EB',
    marginBottom: 16,
  },
  name: {
    marginBottom: 4,
    textAlign: 'center',
  },
  role: {
    textTransform: 'capitalize',
    textAlign: 'center',
    color: '#6B7280', // subtle gray for role
  },
  infoSection: {
    marginBottom: 16,
  },
  actions: {
    marginBottom: 16,
  },
  logoutText: {
    color: '#DC2626',
  },
});
