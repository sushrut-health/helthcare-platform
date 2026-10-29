import { Router } from 'express';
import { DirectoryController } from '../controllers/directory.controller.js';

const router = Router();

// Publicly accessible discovery directory
router.get('/specialties', DirectoryController.getSpecialties);
router.get('/doctors', DirectoryController.getDoctors);
router.get('/doctors/:doctorId', DirectoryController.getDoctorById);
router.get('/doctors/:doctorId/slots', DirectoryController.getDoctorSlots);
router.get('/laboratories', DirectoryController.getLaboratories);
router.get('/laboratories/:laboratoryId', DirectoryController.getLaboratoryById);
router.get('/tests', DirectoryController.getTests);

export default router;
