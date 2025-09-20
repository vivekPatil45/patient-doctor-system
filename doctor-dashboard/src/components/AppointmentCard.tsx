import { Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Doctor {
  _id: string;
  name: string;
  specialization?: string;
  image?: string;
}

interface Patient {
  _id: string;
  name: string;
  email: string;
}

interface Appointment {
  _id: string;
  doctorId: Doctor;
  patientId: Patient;
  date: string;
  time: string;
  reason: string;
  status: string;
  createdAt: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  userRole: 'doctor' | 'patient';
  onStatusUpdate?: (appointmentId: string, status: string) => void;
  onViewPrescription?: (appointmentId: string) => void;
}

const AppointmentCard = ({ appointment, userRole, onStatusUpdate, onViewPrescription }: AppointmentCardProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertCircle, label: 'Scheduled' },
      completed: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, label: 'Cancelled' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </span>
    );
  };

  const themeColors = userRole === 'doctor'
    ? 'border-blue-200 hover:border-blue-300'
    : 'border-purple-200 hover:border-purple-300';

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border ${themeColors} hover:shadow-md transition-all duration-200`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {userRole === 'patient' && (
            <img
              src={appointment.doctorId.image || '/default-doctor.png'}
              alt={appointment.doctorId.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
          )}
          {userRole === 'doctor' && (
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <User className="h-6 w-6 text-gray-600" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">
              {userRole === 'patient' ? appointment.doctorId.name : appointment.patientId.name}
            </h3>
            <p className="text-sm text-gray-500">
              {userRole === 'patient' ? appointment.doctorId.specialization : appointment.patientId.email}
            </p>
          </div>
        </div>
        {getStatusBadge(appointment.status)}
      </div>

      {/* Appointment Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{appointment.date}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{appointment.time}</span>
        </div>
      </div>

      {/* Reason */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Reason:</span> {appointment.reason}
        </p>
      </div>

      {/* Actions */}
      {userRole === 'doctor' && appointment.status === 'scheduled' && (
        <div className="flex space-x-3">
          <button
            onClick={() => onStatusUpdate?.(appointment._id, 'completed')}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark Completed</span>
          </button>
          <button
            onClick={() => onStatusUpdate?.(appointment._id, 'cancelled')}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <XCircle className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {appointment.status === 'completed' && onViewPrescription && (
        <button
          onClick={() => onViewPrescription(appointment._id)}
          className={`w-full ${userRole === 'doctor' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2`}
        >
          <FileText className="h-4 w-4" />
          <span>View Prescription</span>
        </button>
      )}
    </div>
  );
};

export default AppointmentCard;
