import { FileText, Pill } from 'lucide-react';

interface Medicine {
  name: string;
  dosage: string;
  duration: string;
}

interface Prescription {
  _id: string;
  appointmentId: string;
  patientName?: string;
  doctorName?: string;
  doctorSpecialization?: string;
  symptoms: string;
  diagnosis: string;
  medicines: Medicine[];
  notes: string;
  appointmentDate?: string;
  appointmentTime?: string;
  createdAt: string;
}

interface PrescriptionCardProps {
  prescription: Prescription;
  userRole: 'doctor' | 'patient';
}

const PrescriptionCard = ({ prescription, userRole }: PrescriptionCardProps) => {
  const themeColors = userRole === 'doctor' 
    ? 'border-blue-200 hover:border-blue-300' 
    : 'border-purple-200 hover:border-purple-300';

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border ${themeColors} hover:shadow-md transition-all duration-200`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`${
            userRole === 'doctor' ? 'bg-blue-100' : 'bg-purple-100'
          } p-2 rounded-lg`}>
            <FileText className={`h-5 w-5 ${
              userRole === 'doctor' ? 'text-blue-600' : 'text-purple-600'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {userRole === 'patient' ? prescription.doctorName : prescription.patientName}
            </h3>
            <p className="text-sm text-gray-500">
              {userRole === 'patient' ? prescription.doctorSpecialization : 'Patient Prescription'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">
            {new Date(prescription.createdAt).toLocaleDateString()}
          </p>
          {prescription.appointmentDate && (
            <p className="text-xs text-gray-400">
              {prescription.appointmentDate} at {prescription.appointmentTime}
            </p>
          )}
        </div>
      </div>

      {/* Prescription Details */}
      <div className="space-y-4">
        {/* Symptoms */}
        <div className="bg-red-50 border border-red-100 rounded-lg p-3">
          <h4 className="font-medium text-red-700 mb-1 flex items-center space-x-2">
            <span>Symptoms</span>
          </h4>
          <p className="text-red-600 text-sm">{prescription.symptoms}</p>
        </div>

        {/* Diagnosis */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <h4 className="font-medium text-blue-700 mb-1">Diagnosis</h4>
          <p className="text-blue-600 text-sm">{prescription.diagnosis}</p>
        </div>

        {/* Medicines */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-3">
          <h4 className="font-medium text-green-700 mb-2 flex items-center space-x-2">
            <Pill className="h-4 w-4" />
            <span>Prescribed Medicines</span>
          </h4>
          <div className="space-y-2">
            {prescription.medicines.map((medicine, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-green-800">{medicine.name}</h5>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {medicine.duration}
                  </span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  <span className="font-medium">Dosage:</span> {medicine.dosage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        {prescription.notes && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
            <h4 className="font-medium text-yellow-700 mb-1">Additional Notes</h4>
            <p className="text-yellow-600 text-sm">{prescription.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrescriptionCard;