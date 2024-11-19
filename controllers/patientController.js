import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../data/patients.json');

// Utility: Read Patients
const readPatients = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error in Reading Patients.JSON", err);
    return [];
  }
};

// Utility: Write Patients
const writePatients = async (patients) => {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(patients, null, 2), 'utf8');
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
const addPatient = async (req, res) => {
  const patients = await readPatients();
  const newPatient = { id: uuidv4(), ...req.body };

  const errors = validatePatientData(newPatient);
  if (errors.length) {
    return res.render('addPatient', { message: 'ERROR', errors: errors.join(', ') });
  }

  patients.push(newPatient);
  await writePatients(patients);
  res.render('addPatient', { message: 'Patient added successfully!' });
};

// Get All Patients
const getAllPatients = async (req, res) => {
  const patients = await readPatients();
  res.render('patients', { patients });
};

// Search Patients
const searchPatients = async (req, res) => {
  const searchCriteria = req.query;
  const patients = await readPatients();
  const filteredPatients = patients.filter(patient => {
    return Object.keys(searchCriteria).every(key => patient[key] === searchCriteria[key]);
  });
  res.render('searchResult', { patients: filteredPatients });
};

// Render Add Patient Form
const renderAddPatientForm = (req, res) => {
  res.render('addPatient', { message: null, errors: null });
};

//delete patient.


//edit patient.
const editPatient = (req, res)=>{
  
}
export { addPatient, getAllPatients, searchPatients, renderAddPatientForm };
