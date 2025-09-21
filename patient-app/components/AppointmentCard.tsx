import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Avatar, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Appointment } from '@/types';

interface AppointmentCardProps {
  appointment: Appointment;
  onViewPrescription?: (appointmentId: string) => void;
}

export default function AppointmentCard({ 
  appointment, 
  onViewPrescription 
}: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#16A34A';
      case 'confirmed':
        return '#2563EB';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.doctorInfo}>
            <Avatar.Icon
              size={40}
              icon="doctor"
              style={styles.avatar}
            />
            <Text variant="titleMedium" style={styles.doctorName}>
              {appointment.doctorName}
            </Text>
          </View>
          <Chip
            mode="flat"
            textStyle={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}
            style={[styles.statusChip, { backgroundColor: getStatusColor(appointment.status) }]}
          >
            {appointment.status.toUpperCase()}
          </Chip>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="#6B7280" />
            <Text variant="bodyMedium" style={styles.detailText}>
              {formatDate(appointment.date)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#6B7280" />
            <Text variant="bodyMedium" style={styles.detailText}>
              {appointment.time}
            </Text>
          </View>
        </View>

        <Text variant="bodyMedium" style={styles.reason}>
          {appointment.reason}
        </Text>
      </Card.Content>

      {appointment.status === 'completed' && onViewPrescription && (
        <Card.Actions>
          <Button
            mode="outlined"
            onPress={() => onViewPrescription(appointment._id)}
            icon="file-document-outline"
            style={styles.prescriptionButton}
            textColor="#059669"
          >
            View Prescription
          </Button>
        </Card.Actions>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: '#2563EB',
    marginRight: 12,
  },
  doctorName: {
    flex: 1,
  },
  statusChip: {
    height: 28,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    color: '#6B7280',
    marginLeft: 8,
  },
  reason: {
    color: '#374151',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  prescriptionButton: {
    borderColor: '#059669',
    flex: 1,
  },
});