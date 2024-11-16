import express from 'express';
import { addPatient, getAllPatients, searchPatients, renderAddPatientForm } from '../controllers/patientController.js';

const router = express.Router();

// Render Add Patient Form
router.get('/addPatient', renderAddPatientForm);

// Add Patient Route (Handles form submission)
router.post('/addPatient', addPatient);

// Get All Patients Route
router.get('/patients', getAllPatients);

// Search Patients Route
router.get('/searchPatient', searchPatients);

export default router;
