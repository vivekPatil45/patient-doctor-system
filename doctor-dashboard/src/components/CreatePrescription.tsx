import React from 'react';

interface Medicine {
  name: string;
  dosage: string;
  duration: string;
}

interface PrescriptionForm {
  symptoms: string;
  diagnosis: string;
  medicines: Medicine[];
  notes: string;
}

interface Appointment {
  _id: string;
  patientId: { name: string };
}

interface CreatePrescriptionProps {
  selectedAppointment: Appointment;
  prescriptionForm: PrescriptionForm;
  setPrescriptionForm: React.Dispatch<React.SetStateAction<PrescriptionForm>>;
  addMedicine: () => void;
  updateMedicine: (index: number, field: keyof Medicine, value: string) => void;
  removeMedicine: (index: number) => void;
  submitPrescription: () => void;
  cancel: () => void;
}

const CreatePrescription: React.FC<CreatePrescriptionProps> = ({
  selectedAppointment,
  prescriptionForm,
  setPrescriptionForm,
  addMedicine,
  updateMedicine,
  removeMedicine,
  submitPrescription,
  cancel,
}) => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Prescription</h1>
        <p className="text-gray-600">for {selectedAppointment.patientId.name}</p>
      </div>

      <div className="space-y-6">
        {/* Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Symptoms
          </label>
          <textarea
            value={prescriptionForm.symptoms}
            onChange={(e) =>
              setPrescriptionForm({ ...prescriptionForm, symptoms: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Describe the patient's symptoms..."
          />
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diagnosis
          </label>
          <textarea
            value={prescriptionForm.diagnosis}
            onChange={(e) =>
              setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            placeholder="Enter your diagnosis..."
          />
        </div>

        {/* Medicines */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">Medicines</label>
            <button
              type="button"
              onClick={addMedicine}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Medicine
            </button>
          </div>

          {prescriptionForm.medicines.map((medicine, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-white border border-gray-200 rounded-lg"
            >
              <input
                type="text"
                placeholder="Medicine name"
                value={medicine.name}
                onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Dosage"
                value={medicine.dosage}
                onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Duration"
                value={medicine.duration}
                onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => removeMedicine(index)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={prescriptionForm.notes}
            onChange={(e) =>
              setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Any additional notes or instructions..."
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={submitPrescription}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Save Prescription
          </button>
          <button
            onClick={cancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePrescription;
