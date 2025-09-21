import express from 'express';
import { createPrescription, getPrescriptionByAppointment, getPrescriptions } from '../controllers/prescription.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.post('/', createPrescription);
router.get('/', getPrescriptions);
router.get('/:appointmentId', getPrescriptionByAppointment);


export default router;
