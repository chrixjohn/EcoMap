const express = require("express");
const expertauth = require("../middlewares/expertauth");
const upload = require("../config/multer");
const app = express.Router();
const {
  addNewExpert,
  loginexpert,
  getExpertDetails,
  updateExpert,
  deleteExpert,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getUpload,
  getlistUpload,
  getUploadById,
  saveUpload,
  rejectUpload,
  addSpecies,
  getSpecies,
  getSpeciesById,
  updateSpecies,
  deleteSpecies,
  getOccurrencesOfExpert,
  getOccurrence,
  getOccurrenceById,
  updateOccurrence,
  deleteOccurrence,
  countAllDocuments,
  getGeoJSONData,
  speciesMap,
} = require("../controllers/expert");

app.post("/register", addNewExpert);
app.post("/login", loginexpert);
app.get("/get-expert", expertauth, getExpertDetails);
app.put(
  "/update-expert",
  expertauth,
  upload.single("profilepic"),
  updateExpert
);
app.delete("/delete-expert", expertauth, deleteExpert);
app.post("/forgot-password", forgotPassword);
app.post("/verify-otp", verifyOtp);
app.post("/reset-password", resetPassword);

app.get("/get-upload", expertauth, getUpload);
app.get("/get-list-upload", expertauth, getlistUpload);
app.get("/get-upload/:id", expertauth, getUploadById);
app.post("/save-upload", expertauth, saveUpload);
app.post("/reject-upload", expertauth, rejectUpload);

app.post("/add-species", expertauth, upload.single("image"), addSpecies);
app.get("/get-species", getSpecies);
app.get("/get-species/:id", getSpeciesById);
app.post("/update-species/:id", expertauth, updateSpecies);
app.post("/delete-species/:id", expertauth, deleteSpecies);

app.get("/get-expert-occurrences", expertauth, getOccurrencesOfExpert);
app.get("/get-occurance", getOccurrence);
app.get("/get-occurance/:id", getOccurrenceById);
app.put("/occurrence/:id", expertauth, updateOccurrence);
app.delete("/occurrence/:id", expertauth, deleteOccurrence);

app.get("/count", countAllDocuments);

app.get("/map", getGeoJSONData);
app.get("/species-map/:id", speciesMap);

module.exports = app;
