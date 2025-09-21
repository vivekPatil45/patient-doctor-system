import { User, Doctor, Appointment, Prescription, ApiResponse } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './client';

export const patientApi = {
  // 🔹 Register patient
  register: async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await apiClient.post('/auth/register', {
        ...data,
        role: 'patient',
      });

      const { data: userData } = response.data;
      await AsyncStorage.setItem('token', userData.token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      return { success: true, data: userData };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  // 🔹 Login
  login: async (data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await apiClient.post('/auth/login', data);

      const { token, user } = response.data.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      return { success: true, data: { token, user } };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  },

  // 🔹 Get doctors
  getDoctors: async (): Promise<ApiResponse<Doctor[]>> => {
    try {
      const response = await apiClient.get('/doctors');
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { success: false, message: 'Failed to fetch doctors' };
    }
  },

  // 🔹 Get appointments for patient
  getAppointments: async (): Promise<ApiResponse<Appointment[]>> => {
    try {
      const response = await apiClient.get('/appointments');
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { success: false, message: 'Failed to fetch appointments' };
    }
  },

  // 🔹 Book appointment
  bookAppointment: async (data: {
    doctorId: string;
    date: string;
    time: string;
    reason: string;
  }): Promise<ApiResponse<Appointment>> => {
    try {
      const response = await apiClient.post('/appointments', data);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to book appointment',
      };
    }
  },

  // 🔹 Get prescriptions for logged in user
  getPrescriptions: async (): Promise<ApiResponse<Prescription[]>> => {
    try {
      const response = await apiClient.get('/prescriptions');
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { success: false, message: 'Failed to fetch prescriptions' };
    }
  },

  // 🔹 Get single prescription by appointmentId
  getPrescription: async (appointmentId: string): Promise<ApiResponse<Prescription>> => {
    try {
      const response = await apiClient.get(`/prescriptions/${appointmentId}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch prescription' };
    }
  },
};
