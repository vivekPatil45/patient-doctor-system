import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

export const createAppointment = async (req, res) => {
    if (req.user.role !== 'patient') {
        return res.status(403).json({
            success: false,
            message: 'Only patients can book appointments',
        });
    }

    const { doctorId, date, time, reason } = req.body;

    try {
        const appointment = await Appointment.create({
            patientId: req.user._id,
            doctorId,
            date,
            time,
            reason,
        });

        return res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            data: appointment,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAppointments = async (req, res) => {
    try {
        let appointments;

        if (req.user.role === 'doctor') {
            appointments = await Appointment.find({ doctorId: req.user._id })
                .populate('patientId', 'name email');
        } else {
            appointments = await Appointment.find({ patientId: req.user._id })
                .populate('doctorId', 'name specialization image');
        }

        return res.status(200).json({
            success: true,
            message: 'Appointments fetched successfully',
            data: appointments,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    if (req.user.role !== 'doctor') {
        return res.status(403).json({
            success: false,
            message: 'Only doctors can update appointment status',
        });
    }

    const { id } = req.params;
    const { status } = req.body;

    try {
        const appointment = await Appointment.findOne({ _id: id, doctorId: req.user._id });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        appointment.status = status;
        await appointment.save();

        return res.status(200).json({
            success: true,
            message: 'Appointment status updated successfully',
            data: appointment,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
