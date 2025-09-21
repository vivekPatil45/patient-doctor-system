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
  Searchbar,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import { Doctor } from '@/types';
import DoctorCard from '@/components/DoctorCard';
import { patientApi } from '@/api/patientApi';

export default function DoctorsScreen() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await patientApi.getDoctors();
      if (response.success && response.data) {
        setDoctors(response.data);
        setFilteredDoctors(response.data);
      } else {
        setSnackbarMessage(response.message || 'Failed to fetch doctors');
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage('Something went wrong while fetching doctors');
      setSnackbarVisible(true);
      
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, doctors]);

  const handleBookAppointment = (doctor: Doctor) => {
    router.push({
      pathname: '/book-appointment',
      params: {
        doctorId: doctor._id,
        doctorName: doctor.name,
        specialization: doctor.specialization,
      },
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDoctors();
  };

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <DoctorCard doctor={item} onBookAppointment={handleBookAppointment} />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Loading doctors...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Our Doctors
        </Text>
        <Searchbar
          placeholder="Search doctors or specializations..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderDoctor}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No doctors found
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
    paddingBottom: 12,
  },
  title: {
    marginBottom: 16,
  },
  searchbar: {
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
  },
  emptyText: {
    textAlign: 'center',
  },
});
