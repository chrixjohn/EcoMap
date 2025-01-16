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

app.get("/get-upload",expertauth,getUpload)
app.get("/get-list-upload",expertauth,getlistUpload)
app.get("/get-upload-byid/:id",expertauth,getUploadById)

app.post("/add-species",expertauth,addSpecies)
app.get("/get-species",expertauth,getSpecies)
app.post("/update-species/:id",expertauth,updateSpecies)
app.post("/delete-species/:id",expertauth,deleteSpecies)

app.post("/save-occurance",expertauth,saveOccurrence)
app.post("/get-occurance/:id",expertauth,getOccurrenceById)

module.exports=app;