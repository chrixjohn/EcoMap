const express = require("express");
const expertauth = require("../middlewares/expertauth");
const app = express.Router();
const {addNewExpert,loginexpert,getExpertDetails,forgotPassword,verifyOtp,resetPassword,
    getUpload,getlistUpload,getUploadById,
    addSpecies, getSpecies, updateSpecies, deleteSpecies,
    saveOccurrence,getOccurrenceById} = require("../controllers/expert");


app.post("/register",addNewExpert)
app.post("/login",loginexpert)
app.get("/get-user",expertauth,getExpertDetails)
app.post('/forgot-password',forgotPassword)
app.post('/verify-otp',verifyOtp)
app.post('/reset-password', resetPassword);

app.get("/get-upload",getUpload)
app.get("/get-list-upload",getlistUpload)
app.get("/get-upload-byid/:id",getUploadById)

app.post("/add-species",addSpecies)
app.get("/get-species",getSpecies)
app.post("/update-species/:id",updateSpecies)
app.post("/delete-species/:id",deleteSpecies)

app.post("/save-occurance",expertauth,saveOccurrence)
app.post("/get-occurance/:id",expertauth,getOccurrenceById)

module.exports=app;