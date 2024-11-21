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
  const nameRegex = /^[a-zA-Z\s]+$/;
  const phoneRegex = /^(?!^(.)\1{9}$)[0-9]{10}$/;

  if (!patient.name || patient.name.length < 2 || !nameRegex.test(patient.name)) errors.push("Name must contain only letters and spaces, and be at least 2 characters long.");
  if (!patient.age || isNaN(patient.age) || patient.age < 0 || patient.age > 120) errors.push("Age is invalid");
  if (!patient.phone || !phoneRegex.test(patient.phone)) errors.push("Phone number is invalid");
  
  
  return errors;
};
//finding patient logic.
const findMatchingPatients = (patients, criteria) => {
  const validCriteria = Object.fromEntries(
    Object.entries(criteria).filter(([key, value]) => value && value.trim() !== "")
  );

  // Proceed with filtered criteria
  return patients.filter(patient => {
    return Object.keys(validCriteria).every(key => {
      if (typeof validCriteria[key] === 'string') {
        return patient[key].trim().toLowerCase() === validCriteria[key].trim().toLowerCase();
      }
      return patient[key] === validCriteria[key];

    });

  });
  
};

// Add Patient 
const addPatient = async (req, res) => {
  const patients = await readPatients();
  const newPatient = { id: uuidv4(), ...req.body };
  const matchingPatients = findMatchingPatients(patients, {
    name: newPatient.name,
    phone: newPatient.phone
  });
  
  //If we found a match
  if (matchingPatients.length > 0) {
    return res.render('addPatient', {
      message: 'ERROR',
      errors: ['A patient with this name and phone number already exists.'],
      patient: req.body
    });
  }

  const errors = validatePatientData(newPatient);
  if (errors.length) {
    return res.render('addPatient', { message: 'ERROR', errors: errors.join(', ') ,patient:req.body });
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
  try {
    const searchCriteria = req.query;
    const patients = await readPatients();

    if (Object.keys(searchCriteria).length === 0) {
      return res.render('searchResult', { patients });
    }

    const filteredPatients = findMatchingPatients(patients, searchCriteria);

    res.render('searchResult', { patients: filteredPatients });
  } catch (err) {
    console.error("Error searching patients:", err);
    res.status(500).send("Internal server error.");
  }
};

// Render Add Patient Form
const renderAddPatientForm = async(req, res) => {
  try{
  res.render('addPatient', { message: null, errors: null });
  }catch(err){
    console.error("error in rendering addPatient page",err)
    res.status(500).send("Server Error")
  }
  
};



//edit patient.
const editPatientForm = async (req,res)=>{
  try{
    const patients = await readPatients();
    const patient = patients.find(p=> p.id === req.params.id)

    if (!patient) {
      return res.status(404).send("Patient not found.");
    }

    res.render('editPatient', { patient, errors: null });
  }catch(err){
    console.error("Error in editing patient",err)
    res.status(500).send("Server Error")
  }
}

const editPatient = async (req, res) => {
  try {
    const patients = await readPatients();
    const patientIndex = patients.findIndex(p => p.id === req.params.id);
    const patientId = req.params.id

    //patient doesn't exist
    if (patientIndex === -1) {
      return res.status(404).send("Patient not found.");
    }
   
    //deleting patient
    if (req.body.action === 'delete') {
      const updatedPatients = patients.filter(patient => patient.id !== patientId);
      await writePatients(updatedPatients);
      return res.redirect('/patients')
    }


    // Update patient data
    const updatedPatient = {
      //first line will fetch properties (ID), then the rest will be modified 
      ...patients[patientIndex],
      name: req.body.name.trim(),
      age: req.body.age,
      address: req.body.address.trim(),
      phone: req.body.phone.trim(),
    };

    // Validate the updated data
    const errors = validatePatientData(updatedPatient);
    if (errors.length) {
      return res.render('editPatient', { patient: updatedPatient, errors });
    }

    patients[patientIndex] = updatedPatient;
    await writePatients(patients);

    res.redirect('/patients');
  } catch (err) {
    console.error("Error editing patient:", err);
    res.status(500).send("Internal server error.");
  }
};

export { addPatient, getAllPatients, searchPatients, renderAddPatientForm, editPatientForm, editPatient };
