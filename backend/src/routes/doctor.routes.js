import express from 'express';
import { getDoctorById, getDoctors, updateDoctorProfile } from '../controllers/doctor.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/', protect, updateDoctorProfile);

export default router;
