import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { createAppointment, getAppointments, updateAppointmentStatus } from '../controllers/appointment.controller.js';

const router = express.Router();

router.use(protect);
router.post('/', createAppointment);
router.get('/', getAppointments);
router.patch('/:id/status', updateAppointmentStatus);

export default router;
