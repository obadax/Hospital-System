import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, '../data/patients.json');

// Utility: Read Patients
const readPatients = () => {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading patients.json:", err);
    return [];
  }
};

// Utility: Write Patients
const writePatients = (patients) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(patients, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing to patients.json:", err);
  }
};

// Validation: Validate Patient Data
const validatePatientData = (patient) => {
  const errors = [];
  if (!patient.name || patient.name.length < 2) errors.push("Name is invalid");
  if (!patient.age || isNaN(patient.age) || patient.age < 0 || patient.age > 120) errors.push("Age is invalid");
  if (!patient.phone || !/^[0-9]{10}$/.test(patient.phone)) errors.push("Phone number is invalid");
  return errors;
};

// Add Patient
const addPatient = (req, res) => {
  const patients = readPatients();
  const newPatient = { id: uuidv4(), ...req.body };

  const errors = validatePatientData(newPatient);
  if (errors.length) {
    return res.render('addPatient', { message: 'ERROR', errors: errors.join(', ') });
  }

  patients.push(newPatient);
  writePatients(patients);
  res.render('addPatient', { message: 'Patient added successfully!' });
};

// Get All Patients
const getAllPatients = (req, res) => {
  const patients = readPatients();
  res.render('patients', { patients });
};

// Search Patients
const searchPatients = (req, res) => {
  const searchCriteria = req.query;
  const patients = readPatients();
  const filteredPatients = patients.filter(patient => {
    return Object.keys(searchCriteria).every(key => patient[key] === searchCriteria[key]);
  });
  res.render('searchResult', { patients: filteredPatients });
};

// Render Add Patient Form
const renderAddPatientForm = (req, res) => {
    res.render('addPatient', { message: null, errors: null });
  };
  
export { addPatient, getAllPatients, searchPatients, renderAddPatientForm };
  

