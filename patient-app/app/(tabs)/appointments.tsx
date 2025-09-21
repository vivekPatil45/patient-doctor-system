import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import {
  Text,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import AppointmentCard from '@/components/AppointmentCard';
import { Appointment } from '@/types';
import { patientApi } from '@/api/patientApi';
import { useAuthStore } from '@/store/authStore';

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { user } = useAuthStore();
  // console.log(user);
  

  const fetchAppointments = useCallback(async () => {
    if (!user) return;

    try {
      const response = await patientApi.getAppointments(user._id);
      if (response.success && response.data) {
        setAppointments(response.data);
      } else {
        setSnackbarMessage(response.message || 'Failed to fetch appointments');
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage('Something went wrong while fetching appointments');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [user, fetchAppointments]);

  const handleViewPrescription = (appointmentId: string) => {
    router.push({
      pathname: '/view-prescription',
      params: { appointmentId },
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <AppointmentCard
      appointment={item}
      onViewPrescription={handleViewPrescription}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Loading appointments...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          My Appointments
        </Text>
      </View>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderAppointment}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyText}>
              No appointments found
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Book your first appointment with our doctors
            </Text>
          </View>
        }
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
      >
        {snackbarMessage}
      </Snackbar>
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
  loadingText: {
    marginTop: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 32,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
  },
});
