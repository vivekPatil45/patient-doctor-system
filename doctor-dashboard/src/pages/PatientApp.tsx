import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import { PatientStats } from '../components/DashboardStats';
import AppointmentCard from '../components/AppointmentCard';
import PrescriptionCard from '../components/PrescriptionCard';
import { Star} from 'lucide-react';
import axios from 'axios';
import type { ApiResponse, Appointment, Doctor, Prescription } from '../types/types';
import toast from 'react-hot-toast';

const PatientApp = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', reason: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
    fetchPrescriptions();
  }, []);

    const fetchDoctors = async () => {
    try {
      const response = await axios.get<ApiResponse<Doctor[]>>(`${API_BASE_URL}/api/doctors`);
      setDoctors(response.data.data);
    } catch (error: unknown) {
      console.error('Error fetching doctors:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to fetch doctors');
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to fetch doctors');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const response = await axios.get<ApiResponse<Appointment[]>>(`${API_BASE_URL}/api/appointments`);
      setAppointments(response.data.data);
    } catch (error: unknown) {
      console.error('Error fetching appointments:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to fetch appointments');
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to fetch appointments');
      }
    }
  };

  // Fetch all prescriptions
  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get<ApiResponse<Prescription[]>>(`${API_BASE_URL}/api/prescriptions`);
      const prescriptions = response.data.data.map(pres => ({ ...pres, id: pres._id }));
      setPrescriptions(prescriptions);
    } catch (error: unknown) {
      console.error('Error fetching prescriptions:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to fetch prescriptions');
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to fetch prescriptions');
      }
    }
  };

  // Book an appointment
  const bookAppointment = async () => {
    if (!selectedDoctor || !bookingForm.date || !bookingForm.time || !bookingForm.reason) {
      toast.error('Please fill all fields.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/appointments`, {
        doctorId: selectedDoctor._id,
        date: bookingForm.date,
        time: bookingForm.time,
        reason: bookingForm.reason,
        patientId: user?._id // logged-in patient ID
      });

      toast.success('Appointment booked successfully!');
      setBookingForm({ date: '', time: '', reason: '' });
      setSelectedDoctor(null);
      setActiveTab('appointments');
      fetchAppointments(); // refresh appointment list
    } catch (error: unknown) {
      console.error('Error booking appointment:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to book appointment.');
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to book appointment.');
      }
    }
  };

    


  
  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
  const scheduledAppointments = appointments.filter(apt => apt.status === 'scheduled').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Clinix Sphere...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Patient Dashboard</h1>
              <p className="text-gray-600 mb-4">Welcome back, {user?.name}</p>
              <PatientStats
                totalAppointments={appointments.length}
                scheduledAppointments={scheduledAppointments}
                completedAppointments={completedAppointments}
                totalPrescriptions={prescriptions.length}
              />
            </div>
          )}

          {/* Book Appointment */}
          {activeTab === 'book-appointment' && !selectedDoctor && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Appointment</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {doctors.map(doc => (
                <div
                  key={doc._id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-purple-300 transition-all duration-200"
                >
                  <div className="text-center">
                    <img
                      src={doc.image || '/default-doctor.png'}
                      alt={doc.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                    />
                    <h3 className="font-semibold text-gray-900 mb-1">{doc.name}</h3>
                    <p className="text-purple-600 font-medium mb-2">{doc.specialization}</p>
                    <p className="text-sm text-gray-500 mb-3">{doc.experience} experience</p>
                    <div className="flex items-center justify-center space-x-1 mb-4">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{doc.rating}</span>
                    </div>
                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}

              </div>
            </div>
          )}

          {/* Appointment Details Form */}
          {selectedDoctor && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <button onClick={() => setSelectedDoctor(null)} className="text-purple-600 mb-4">← Back to Doctors</button>
              <h2 className="text-xl font-bold mb-4">Book Appointment with {selectedDoctor.name}</h2>

              <label className="block mb-2">Select Date:</label>
              <input
                type="date"
                className="border rounded px-3 py-2 mb-4 w-full"
                value={bookingForm.date}
                onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
              />

              <label className="block mb-2">Select Time:</label>
              <select
                className="border rounded px-3 py-2 mb-4 w-full"
                value={bookingForm.time}
                onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })}
              >
                <option value="">Select time</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:00 PM">02:00 PM</option>
              </select>

              <label className="block mb-2">Reason for Appointment:</label>
              <textarea
                className="border rounded px-3 py-2 mb-4 w-full"
                rows={3}
                placeholder="Enter reason"
                value={bookingForm.reason}
                onChange={e => setBookingForm({ ...bookingForm, reason: e.target.value })}
              />

              <button
                onClick={bookAppointment}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full"
              >
                Book Appointment
              </button>
            </div>
          )}


          {/* Appointments */}
          {activeTab === 'appointments' && (
            <div>
              <h2 className="text-xl font-bold mb-2">My Appointments</h2>
              {appointments.map(appt => (
                <AppointmentCard key={appt._id} appointment={appt} userRole="patient" />
              ))}
            </div>
          )}

          {/* Prescriptions */}
          {activeTab === 'prescriptions' && (
            <div>
              <h2 className="text-xl font-bold mb-2">My Prescriptions</h2>
              {prescriptions.map(pres => (
                <PrescriptionCard key={pres._id} prescription={pres} userRole="patient" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientApp;
