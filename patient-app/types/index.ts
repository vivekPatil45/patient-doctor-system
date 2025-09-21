export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'patient';
  image?:string;
}

// Doctor model
export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  image?: string;
  rating?: number; // e.g., 4.5
  experience?: string; // e.g., "10 years"
  availability?: string[]; // e.g., ["Mon-Fri 10am-2pm"]
  hospital?: string;
}

// Appointment model
export interface Appointment {
  _id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reason: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}


// Prescription model
export interface Prescription {
  _id: string;
  appointmentId: string;
  doctorId?: string;
  patientId?: string;
  symptoms: string;
  diagnosis: string;
  medicines: Medicine[];
  additionalNotes?: string;
  prescribedAt: string;
}

// Medicine model
export interface Medicine {
  name: string;
  dosage: string; // e.g., "500mg"
  duration: string; // e.g., "5 days"
  instructions?: string; // e.g., "Take after food"
}

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}