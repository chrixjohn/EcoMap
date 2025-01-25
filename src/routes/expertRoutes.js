const express = require("express");
const expertauth = require("../middlewares/expertauth");
const upload = require("../config/multer");
const app = express.Router();
const {addNewExpert,loginexpert,getExpertDetails,forgotPassword,verifyOtp,resetPassword,
    getUpload,getlistUpload,getUploadById,
    addSpecies, getSpecies,getSpeciesById, updateSpecies, deleteSpecies,
    saveOccurrence,getOccurrence,getOccurrenceById,
    countAllDocuments,
    searchSpecies, filterByConservationStatus, sortSpecies, filterSpecies,filterOccurrences,
    getGeoJSONData} = require("../controllers/expert");


app.post("/register",addNewExpert)
app.post("/login",loginexpert)
app.get("/get-user",expertauth,getExpertDetails)
app.post('/forgot-password',forgotPassword)
app.post('/verify-otp',verifyOtp)
app.post('/reset-password', resetPassword);

app.get("/get-upload",expertauth,getUpload)
app.get("/get-list-upload",expertauth,getlistUpload)
app.get("/get-upload-byid/:id",expertauth,getUploadById)

app.post("/add-species",expertauth,upload.single('image'),addSpecies)
app.get("/get-species",getSpecies)
app.get("/get-species-byid/:id",getSpeciesById)
app.post("/update-species/:id",expertauth,updateSpecies)
app.post("/delete-species/:id",expertauth,deleteSpecies)

app.post("/save-occurance",expertauth,saveOccurrence)
app.get("/get-occurance",getOccurrence)
app.get("/get-occurance/:id",getOccurrenceById)

app.get("/count",countAllDocuments)

app.get("/search-species",searchSpecies)
app.get("/filter-conservationstatus",filterByConservationStatus)
app.get("/sort-species",sortSpecies)
app.get("/filter-species",filterSpecies)
app.get("/filter-occurrences",filterOccurrences)

app.get("/map",getGeoJSONData);

module.exports=app;