import  { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {  Users, Calendar, FileText } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import Sidebar from '../components/Sidebar';
import { DoctorStats } from '../components/DashboardStats';
import AppointmentCard from '../components/AppointmentCard';
import PrescriptionCard from '../components/PrescriptionCard';
import ProfileCard from '../components/ProfileCard';
import type { ApiResponse, Appointment, Prescription } from '../types/types';
import CreatePrescription from '../components/CreatePrescription';
import toast from 'react-hot-toast';

const DoctorDashboard= () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    symptoms: '',
    diagnosis: '',
    medicines: [{ name: '', dosage: '', duration: '' }],
    notes: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
    fetchPrescriptions();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get<ApiResponse<Appointment[]>>(`${API_BASE_URL}/api/appointments`);
      console.log(response.data.data);
      setAppointments(response.data.data);
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

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get<ApiResponse<Prescription[]>>(`${API_BASE_URL}/api/prescriptions`);
      setPrescriptions(response.data.data);
    }catch (error: unknown) {
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

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/appointments/${appointmentId}/status`, { status });
      toast.success('Appointment status updated');
      fetchAppointments();

      if (status === 'completed') {
        const appointment = appointments.find(apt => apt._id === appointmentId);
        if (appointment) {
          setSelectedAppointment(appointment);
          setActiveTab('prescription');
        }
      }
    }catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Failed to update status');
      console.error(axiosError);
    }
  };

  const submitPrescription = async () => {
    if (!selectedAppointment) return;

    try {
      await axios.post(`${API_BASE_URL}/api/prescriptions`, {
        appointmentId: selectedAppointment._id,
        ...prescriptionForm
      });

      toast.success('Prescription created successfully');

      setPrescriptionForm({
        symptoms: '',
        diagnosis: '',
        medicines: [{ name: '', dosage: '', duration: '' }],
        notes: ''
      });
      setSelectedAppointment(null);
      setActiveTab('appointments');
      fetchPrescriptions();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Failed to create prescription');
      console.error(axiosError);
    }
  };



  const addMedicine = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: [...prescriptionForm.medicines, { name: '', dosage: '', duration: '' }]
    });
  };

  const updateMedicine = (index: number, field: string, value: string) => {
    const updatedMedicines = [...prescriptionForm.medicines];
    updatedMedicines[index] = { ...updatedMedicines[index], [field]: value };
    setPrescriptionForm({ ...prescriptionForm, medicines: updatedMedicines });
  };

  const removeMedicine = (index: number) => {
    const updatedMedicines = prescriptionForm.medicines.filter((_, i) => i !== index);
    setPrescriptionForm({ ...prescriptionForm, medicines: updatedMedicines });
  };


  

  

  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
  // const scheduledAppointments = appointments.filter(apt => apt.status === 'scheduled').length;
  const todayAppointments = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0] && apt.status === 'scheduled'
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
          {activeTab === 'dashboard' && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
                <p className="text-gray-600">Welcome back, Dr. {user?.name?.split(' ').pop()}</p>
              </div>

              <DoctorStats
                totalAppointments={appointments.length}
                scheduledAppointments={todayAppointments}
                completedAppointments={completedAppointments}
                totalPrescriptions={prescriptions.length}
              />

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-3">
                    {appointments.filter(apt => apt.status === 'scheduled').slice(0, 3).map((appointment) => (
                      <div key={appointment._id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{appointment.patientId.name}</p>
                          <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {appointment.reason.substring(0, 20)}...
                        </span>
                      </div>
                    ))}
                    {appointments.filter(apt => apt.status === 'scheduled').length === 0 && (
                      <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                    )}
                  </div>
                </div>

                {/* Recent Prescriptions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Prescriptions</h3>
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-3">
                    {prescriptions.slice(0, 3).map((prescription) => (
                      <div key={prescription._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{prescription.patientName}</p>
                          <p className="text-sm text-gray-600">{prescription.diagnosis}</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {prescription.medicines.length} medicines
                        </span>
                      </div>
                    ))}
                    {prescriptions.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No prescriptions yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointments</h1>
                <p className="text-gray-600">Manage your patient appointments</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    userRole="doctor"
                    onStatusUpdate={updateAppointmentStatus}
                  />
                ))}
              </div>
              
              {appointments.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No appointments scheduled</p>
                  <p className="text-gray-400">Appointments will appear here when patients book with you</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Prescriptions</h1>
                <p className="text-gray-600">View and manage prescription history</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {prescriptions.map((prescription) => (
                  <PrescriptionCard
                    key={prescription._id}
                    prescription={prescription}
                    userRole="doctor"
                  />
                ))}
              </div>
              
              {prescriptions.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No prescriptions created yet</p>
                  <p className="text-gray-400">Prescriptions will appear here after completing appointments</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'prescription' && selectedAppointment && (
            <CreatePrescription
              selectedAppointment={selectedAppointment}
              prescriptionForm={prescriptionForm}
              setPrescriptionForm={setPrescriptionForm}
              addMedicine={addMedicine}
              updateMedicine={updateMedicine}
              removeMedicine={removeMedicine}
              submitPrescription={submitPrescription}
              cancel={() => {
                setSelectedAppointment(null);
                setActiveTab('dashboard');
              }}
            />
          )}


          {activeTab === 'profile' && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
                <p className="text-gray-600">Manage your professional information</p>
              </div>
              
               <ProfileCard
                name={user?.name}
                email={user?.email}
                specialization={user?.specialization}
                experience={user?.experience}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;