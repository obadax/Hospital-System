import express from 'express';
import {
  renderAddDoctorForm,
  addDoctor,
  getAllDoctors,
  renderEditDoctorForm,
  editDoctor,
  deleteDoctor
} from '../controllers/doctorController.js';

const router = express.Router();

// Route to display form for adding a new doctor
router.get('/addDoctor', renderAddDoctorForm);

// Route to handle adding a new doctor
router.post('/addDoctor', addDoctor);

// Route to display all doctors
router.get('/doctors', getAllDoctors);

// Route to display the edit form for a specific doctor
router.get('/editDoctor/:id', renderEditDoctorForm);

// Route to handle editing a doctor
router.post('/editDoctor/:id', editDoctor);

// Route to handle deleting a doctor
router.post('/deleteDoctor/:id', deleteDoctor);

export default router;
