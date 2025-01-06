const express = require("express");
const userauth = require("../middlewares/expertauth");
const app = express.Router();
const {addNewExpert,loginexpert,getExpertDetails,forgotPassword,verifyOtp,resetPassword} = require("../controllers/expert");
const expertauth = require("../middlewares/expertauth");

app.post("/register",addNewExpert)
app.post("/login",loginexpert)
app.get("/get-user",expertauth,getExpertDetails)
app.post('/forgot-password',forgotPassword)
app.post('/verify-otp',verifyOtp)
app.post('/reset-password', resetPassword);



module.exports=app;