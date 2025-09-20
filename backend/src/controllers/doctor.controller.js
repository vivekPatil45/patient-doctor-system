import User from '../models/User.js';

// Get all doctors
export const getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');

        return res.status(200).json({
            success: true,
            message: "Doctors fetched successfully",
            data: doctors,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
    try {
        const doctor = await User.findById(req.params.id).select('-password');
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        return res.status(200).json({
            success: true,
            message: "Doctor fetched successfully",
            data: doctor,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update logged-in doctor profile
export const updateDoctorProfile = async (req, res) => {
    const { name, email, specialization, experience, image } = req.body;

    try {
        const doctor = await User.findById(req.user.id);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        doctor.name = name || doctor.name;
        doctor.email = email || doctor.email;
        doctor.specialization = specialization || doctor.specialization;
        doctor.experience = experience || doctor.experience;
        doctor.image = image || doctor.image;

        await doctor.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: doctor,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
