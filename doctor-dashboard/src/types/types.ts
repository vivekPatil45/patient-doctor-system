export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface User {
    _id: string;
    email: string;
    name: string;
    role: 'doctor' | 'patient';
    profileSetup?: boolean;
    specialization?: string;
    experience?: string;
    rating?: number;
    image?: string;
}
export interface PatientLite {
  _id: string;
  name: string;
  email: string;
}


export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}


export interface Doctor {
    _id: string;
    name: string;
    specialization?: string;
    experience?: string;
    rating?: number; 
    image?: string;
}
export interface Patient {
    _id: string;
    name: string;
    email: string;
}

export interface Appointment {
    _id: string;
    doctorId: Doctor;
    patientId: Patient | PatientLite; // use `any` if patient structure differs in PatientApp
    date: string;
    time: string;
    reason: string;
    status: AppointmentStatus;
    createdAt: string;
}

export interface Prescription {
    _id: string;
    appointmentId: string;
    doctorId?: Doctor;       // optional for DoctorDashboard
    patientName?: string;    // optional for PatientApp
    symptoms: string;
    diagnosis: string;
    medicines: Array<{
        name: string;
        dosage: string;
        duration: string;
    }>;
    notes: string;
    createdAt: string;
}