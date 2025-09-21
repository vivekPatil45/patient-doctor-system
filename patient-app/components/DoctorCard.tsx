import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Avatar, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Doctor } from '@/types';

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctor: Doctor) => void;
}

export default function DoctorCard({ doctor, onBookAppointment }: DoctorCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Avatar.Icon
            size={56}
            icon="doctor"
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text variant="titleMedium" style={styles.name}>
              {doctor.name}
            </Text>
            <Chip mode="outlined" compact style={styles.specializationChip}>
              {doctor.specialization}
            </Chip>
            {doctor.rating && (
              <View style={styles.rating}>
                <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                <Text variant="bodySmall" style={styles.ratingText}>
                  {doctor.rating}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        {doctor.experience && (
          <View style={styles.detail}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#6B7280" />
            <Text variant="bodySmall" style={styles.detailText}>
              {doctor.experience} experience
            </Text>
          </View>
        )}
      </Card.Content>

      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => onBookAppointment(doctor)}
          style={styles.bookButton}
          contentStyle={styles.buttonContent}
        >
          Book Appointment
        </Button>
      </Card.Actions>
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
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: '#2563EB',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    marginBottom: 4,
  },
  specializationChip: {
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#F59E0B',
    marginLeft: 4,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    color: '#6B7280',
    marginLeft: 8,
  },
  bookButton: {
    flex: 1,
  },
  buttonContent: {
    paddingVertical: 4,
  },
});