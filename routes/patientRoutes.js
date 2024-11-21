import express from 'express';
import { addPatient, getAllPatients, searchPatients, renderAddPatientForm ,editPatient, editPatientForm } from '../controllers/patientController.js';

const router = express.Router();

// Render Add Patient Form
router.get('/addPatient', renderAddPatientForm);

// Add Patient Route (Handles form submission)
router.post('/addPatient', addPatient);

// Get All Patients Route
router.get('/patients', getAllPatients);

// Search Patients Route
router.get('/searchPatient', searchPatients);

// Route to render the edit patient form
router.get('/editPatient/:id', editPatientForm);

// Route to handle the edit patient submission
router.post('/editPatient/:id', editPatient);

export default router;
