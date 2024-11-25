import { v4 as uuidv4 } from 'uuid';
import { readDoctors, writeDoctors } from '../models/doctorModel.js';

// Utility: Validate Doctor Data
const validateDoctorData = (doctor) => {
  const errors = [];
  const nameRegex = /^[a-zA-Z\s]+$/;
  const dayRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/;

  if (!doctor.name || !nameRegex.test(doctor.name.up)) {
    errors.push("Name must contain only letters and spaces.");
  }
  if (!doctor.specialization) {
    errors.push("Specialization is required.");
  }
  if (!doctor.availableDays) {
    errors.push("Available days are required.");
  } else {
    const days = doctor.availableDays.split(',').map(day => day.trim());
    if (!days.every(day => dayRegex.test(day))) {
      errors.push("Available days must be valid weekdays (e.g., Monday, Tuesday). (Capital First Letter and split using ',' )");
    }
  }
  if (!doctor.availableTime) {
    errors.push("Available time is required.");
  }
  if (doctor.consultationFee && isNaN(doctor.consultationFee)) {
    errors.push("Consultation fee must be a number.");
  }

  return errors;
};

// Controller: Add Doctor
const addDoctor = async (req, res) => {
  try {
    const doctors = await readDoctors();
    const newDoctor = { id: uuidv4(), ...req.body };

    const errors = validateDoctorData(newDoctor);
    if (errors.length) {
      return res.render('addDoctor', { message: 'ERROR', errors, doctor: req.body });
    }

    doctors.push(newDoctor);
    await writeDoctors(doctors);
    res.render('addDoctor', { message: 'Doctor added successfully!', errors: null });
  } catch (err) {
    console.error("Error adding doctor:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Controller: Get All Doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await readDoctors();
    res.render('doctors', { doctors });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Controller: Edit Doctor (Render Form)
const renderEditDoctorForm = async (req, res) => {
  try {
    const doctors = await readDoctors();
    const doctor = doctors.find(d => d.id === req.params.id);

    if (!doctor) {
      return res.status(404).send("Doctor not found.");
    }

    res.render('editDoctor', { doctor, errors: null });
  } catch (err) {
    console.error("Error rendering edit doctor form:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Controller: Edit Doctor (Submit Changes)
const editDoctor = async (req, res) => {
  try {
    const doctors = await readDoctors();
    const doctorIndex = doctors.findIndex(d => d.id === req.params.id);

    if (doctorIndex === -1) {
      return res.status(404).send("Doctor not found.");
    }

    const updatedDoctor = {
      ...doctors[doctorIndex],
      name: req.body.name.trim(),
      specialization: req.body.specialization.trim(),
      availableDays: req.body.availableDays.trim(),
      availableTime: req.body.availableTime.trim(),
      consultationFee: req.body.consultationFee.trim(),
    };

    const errors = validateDoctorData(updatedDoctor);
    if (errors.length) {
      return res.render('editDoctor', { doctor: updatedDoctor, errors });
    }

    doctors[doctorIndex] = updatedDoctor;
    await writeDoctors(doctors);

    res.redirect('/doctors');
  } catch (err) {
    console.error("Error editing doctor:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Controller: Delete Doctor
const deleteDoctor = async (req, res) => {
  try {
    const doctors = await readDoctors();
    const updatedDoctors = doctors.filter(d => d.id !== req.params.id);

    await writeDoctors(updatedDoctors);
    res.redirect('/doctors');
  } catch (err) {
    console.error("Error deleting doctor:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Controller: Render Add Doctor Form
const renderAddDoctorForm = (req, res) => {
  res.render('addDoctor', { message: null, errors: null });
};

export {
  addDoctor,
  getAllDoctors,
  renderAddDoctorForm,
  renderEditDoctorForm,
  editDoctor,
  deleteDoctor,
};
