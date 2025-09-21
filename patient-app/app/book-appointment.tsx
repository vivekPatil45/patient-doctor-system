import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm, Controller } from 'react-hook-form';
import { patientApi } from '@/api/patientApi';
import Toast from 'react-native-toast-message';

interface FormData {
  date: Date;
  time: Date;
  reason: string;
}

export default function BookAppointmentScreen() {
  const params = useLocalSearchParams();
  const { doctorId, doctorName, specialization } = params;

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      date: new Date(),
      time: new Date(),
      reason: '',
    },
  });

  const selectedDate = watch('date');
  const selectedTime = watch('time');

  const onDateChange = (_event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) setValue('date', date);
  };

  const onTimeChange = (_event: any, time?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) setValue('time', time);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await patientApi.bookAppointment({
        doctorId: doctorId as string,
        date: data.date.toISOString().split('T')[0],
        time: data.time.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        reason: data.reason,
      });

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Appointment booked successfully!',
        });
        router.replace('/(tabs)/appointments');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Failed to book appointment',
        });
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (time: Date) =>
    time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Book Appointment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Doctor Info */}
        <View style={styles.doctorCard}>
          <View style={styles.avatarContainer}>
            <User size={32} color="#6B7280" />
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctorName}</Text>
            <Text style={styles.doctorSpecialization}>{specialization}</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Date Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
              <Calendar size={20} color="#6B7280" />
              <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={onDateChange}
              />
            )}
          </View>

          {/* Time Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowTimePicker(true)}>
              <Clock size={20} color="#6B7280" />
              <Text style={styles.dateTimeText}>{formatTime(selectedTime)}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker value={selectedTime} mode="time" display="default" onChange={onTimeChange} />
            )}
          </View>

          {/* Reason */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Reason for Visit</Text>
            <Controller
              control={control}
              rules={{
                required: 'Please provide a reason for your visit',
                minLength: { value: 10, message: 'Minimum 10 characters required' },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe your symptoms or reason for consultation..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              )}
              name="reason"
            />
            {errors.reason && <Text style={styles.errorText}>{errors.reason.message}</Text>}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.bookButton, loading && styles.disabledButton]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            <Text style={styles.bookButtonText}>{loading ? 'Booking...' : 'Book Appointment'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
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
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  doctorSpecialization: { fontSize: 14, color: '#6B7280' },
  form: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 },
  dateTimeButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF' },
  dateTimeText: { fontSize: 16, color: '#111827', marginLeft: 12 },
  textArea: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#111827', backgroundColor: '#FFFFFF', minHeight: 100 },
  errorText: { color: '#DC2626', fontSize: 14, marginTop: 4, marginLeft: 4 },
  bookButton: { backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  disabledButton: { opacity: 0.6 },
  bookButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
});
