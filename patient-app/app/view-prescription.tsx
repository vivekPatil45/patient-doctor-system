import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, FileText, Pill, Calendar } from 'lucide-react-native';
import { Prescription } from '@/types';
import { patientApi } from '@/api/patientApi';

export default function ViewPrescriptionScreen() {
  const params = useLocalSearchParams();
  const { appointmentId } = params;

  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appointmentId) fetchPrescription();
  }, [appointmentId]);

  const fetchPrescription = async () => {
    try {
      const response = await patientApi.getPrescription(appointmentId as string);
      if (response.success && response.data) {
        setPrescription(response.data);
        // console.log(prescription);
        
      } else {
        Alert.alert('Error', response.message || 'Failed to fetch prescription');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading prescription...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!prescription) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>Prescription</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Prescription not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Prescription</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.prescriptionCard}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <FileText size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Medical Prescription</Text>
          </View>

          {/* Prescribed Date */}
          <View style={styles.dateContainer}>
            <Calendar size={16} color="#6B7280" />
            <Text style={styles.dateText}>
              Prescribed on {formatDate(prescription.prescribedAt)}
            </Text>
          </View>

          {/* Symptoms */}
          {prescription.symptoms && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Symptoms</Text>
              <Text style={styles.sectionContent}>{prescription.symptoms}</Text>
            </View>
          )}

          {/* Diagnosis */}
          {prescription.diagnosis && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Diagnosis</Text>
              <Text style={styles.sectionContent}>{prescription.diagnosis}</Text>
            </View>
          )}

          {/* Medicines */}
          {prescription.medicines?.length > 0 && (
            <View style={styles.section}>
              <View style={styles.medicineHeader}>
                <Pill size={20} color="#059669" />
                <Text style={styles.sectionTitle}>Prescribed Medicines</Text>
              </View>
              {prescription.medicines.map((medicine, index) => (
                <View key={index} style={styles.medicineCard}>
                  <View style={styles.medicineInfo}>
                    <Text style={styles.medicineName}>{medicine.name}</Text>
                    <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
                    <Text style={styles.medicineDuration}>
                      Duration: {medicine.duration}
                    </Text>
                    {medicine.instructions && (
                      <Text style={styles.medicineInstructions}>
                        {medicine.instructions}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Additional Notes */}
          {prescription.additionalNotes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Notes</Text>
              <Text style={styles.sectionContent}>
                {prescription.additionalNotes}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles remain mostly the same
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#6B7280' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#DC2626' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { padding: 8 },
  title: { fontSize: 20, fontWeight: '600', color: '#111827' },
  placeholder: { width: 40 },
  content: { flex: 1, padding: 16 },
  prescriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginLeft: 12 },
  dateContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dateText: { fontSize: 14, color: '#6B7280', marginLeft: 8 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 },
  sectionContent: { fontSize: 16, color: '#374151', lineHeight: 24 },
  medicineHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  medicineCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  medicineInfo: { flex: 1 },
  medicineName: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  medicineDosage: { fontSize: 16, color: '#059669', fontWeight: '500', marginBottom: 4 },
  medicineDuration: { fontSize: 14, color: '#6B7280', marginBottom: 6 },
  medicineInstructions: { fontSize: 14, color: '#374151', fontStyle: 'italic' },
});
