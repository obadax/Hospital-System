import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the patients.json file
const dataFile = path.join(__dirname, '../data/patients.json');

// GET route to render the add patient form
router.get('/addPatient', (req, res) => {
  res.render('addPatient');
});

const validatePatientData = (patient) =>{
  const errors =[]

  if(!patient.name ||patient.name.length <2){
    errors.push("Name is invalid, should be at least 2 characters")
  }
  if(!patient.age|| isNaN(patient.age)|| patient.age<0 ||patient.age>120){
    errors.push("Age is invalid, must be between 0-120")
  }
  const phonePattern = /^[0-9]{10}$/;
  if(!patient.phone ||!phonePattern.test(patient.phone)){
    errors.push("Phone num is invalid")
  }
  return errors
}
function findPatient(patients, criteria) {
  return patients.filter(patient => {
    for (let key in criteria) {
      if (patient[key] !== criteria[key]) {
        return false;
      }
    }
    return true;
  });
}


// POST route to add a new patient
router.post('/addPatient', (req, res) => {
  const newPatient = {
    id: uuidv4(),
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
    phone: req.body.phone,
  };

  const validateErrors = validatePatientData(newPatient);
  if(validateErrors.length){
    return res.render("addPatient",{message: "ERROR",errors:validateErrors.join(" ")})
  }
  // Read existing patients from patients.json
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) {
      console.error("Could not read file:", err);
      return res.status(500).send("Server error");
    }

    const patients = data ? JSON.parse(data) : [];
    patients.push(newPatient);

    // Write updated patient list back to patients.json
    fs.writeFile(dataFile, JSON.stringify(patients, null, 2), (err) => {
      if (err) {
        console.error("Could not write file:", err);
        return res.status(500).send("Server error");
      }
      res.render('addPatient', { message: 'Patient added successfully!' });
      console.log(req.body)
    });
  });
});

// GET route to display all patients
router.get('/patients', (req, res) => {
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) {
      console.error("Could not read file:", err);
      return res.status(500).send("Server error");
    }

    const patients = data ? JSON.parse(data) : [];
    res.render('patients', { patients });
  });
});

router.get("/editPatient",(req,res)=>{
  const patientId =req.params.id;
  
  fs.readFile(dataFile, 'utf8',(err,data)=>{
    if(err){
      console.error("could not read file",err)
      return res.status(500).send("Server error")
    }

    const patients = JSON.parse(data);
    const patient = patients.find(p=> p.id ===patientId)
    if(!patient){
      return res.status(404).send("Patient not found")

      
    }
    res.render('editPatient',{patient})
  })
})

router.get("/searchPatient",(req,res)=>{
  const searchCriteria ={};
  console.log(req.query)
  if(req.query.name){
    searchCriteria.name = req.query.name;
  }
  if(req.query.phone){
    searchCriteria.phone = req.query.phone;
  }
  fs.readFile(dataFile,'utf-8',(err,data)=>{
    if(err){
      console.error("Could not read the file",err);
      return res.status(500).send("Server Error")
    }
    const patients = data ? JSON.parse(data):[];
    const matchingPatients = findPatient(patients,searchCriteria);
    res.render('searchResult',{patients:matchingPatients ||[]})
  })
})
export default router;
