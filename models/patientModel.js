import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../data/patients.json');

// Utility: Read Patients
export const readPatients = async () => {
    try {
      const data = await fs.readFile(dataFilePath, 'utf8');
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error("Error in Reading Patients.JSON", err);
      return [];
    }
  };
  
  // Utility: Write Patients
export const writePatients = async (patients) => {
    try {
      await fs.writeFile(dataFilePath, JSON.stringify(patients, null, 2), 'utf8');
    } catch (err) {
      console.error("Error writing to patients.json:", err);
    }
  };