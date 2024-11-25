import{promises as fs} from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../data/doctors.json');

//Read Doctors

export const readDoctors = async()=>{
    try{
        const data = await fs.readFile(dataFilePath,'utf8')
        return data? JSON.parse(data):[];
    }catch(err){
        console.error("Cant read doctors.json",err)
        return [];
    }
};

//Write Doctors
export const writeDoctors = async(doctors)=>{
    try{
        await fs.writeFile(dataFilePath, JSON.stringify(doctors,null,2),'utf-8')
    }catch(err){
        console.error("Error writing to doctors.json",err)
    }
}