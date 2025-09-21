import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';

export const createPrescription = async (req, res) => {
    if (req.user.role !== 'doctor') {
        return res.status(403).json({
            success: false,
            message: 'Only doctors can create prescriptions',
        });
    }

    const { appointmentId, symptoms, diagnosis, medicines, notes } = req.body;

    try {
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            doctorId: req.user._id,
            status: 'completed',
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Completed appointment not found',
            });
        }

        const prescription = await Prescription.create({
            appointmentId,
            patientId: appointment.patientId,
            doctorId: req.user._id,
            symptoms,
            diagnosis,
            medicines,
            notes,
        });

        return res.status(201).json({
            success: true,
            message: 'Prescription created successfully',
            data: prescription,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getPrescriptions = async (req, res) => {
    try {
        let prescriptions;

        if (req.user.role === 'doctor') {
            prescriptions = await Prescription.find({ doctorId: req.user._id });
        } else {
            prescriptions = await Prescription.find({ patientId: req.user._id });
        }

        return res.status(200).json({
            success: true,
            message: 'Prescriptions fetched successfully',
            data: prescriptions,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const getPrescriptionByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    console.log(appointmentId);
    

    // // Check if appointment exists and belongs to the user
    // const appointment = await Prescription.find({a});
    // console.log(appointment);
    
    // if (!appointment) {
    //   return res.status(404).json({ success: false, message: 'Appointment not found' });
    // }

    // Fetch prescription linked to this appointment
    const prescription = await Prescription.findOne({ appointmentId: appointmentId });
    console.log(prescription);
    
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    res.json({ success: true, data: prescription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};