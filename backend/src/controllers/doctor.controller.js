import User from '../models/User.js';

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
