import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) 
          return res.status(400).json({
            success: false,
            message: "User already exists",
          });

        const user = await User.create({ name, email, password, role: role || 'patient' });
        const token = generateToken(user._id, user.role);

        return res.status(201).json({
          success: true,
          message: "Successfully created account",
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
          },
        });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          specialization: user.specialization,
          experience: user.experience,
          rating: user.rating,
          image: user.image,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
