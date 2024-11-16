import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import patientRoutes from "./routes/patientRoutes.js";  // Import the patient routes

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the template engine and define static files and body parsing
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Main route to check if server is running
app.get("/", (req, res) => {
  res.send("Hospital Management System is running");
});

// Use the patientRoutes for handling patient-related routes
app.use("/", patientRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
