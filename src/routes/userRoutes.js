const express = require("express");
const userauth = require("../middlewares/userauth");
const app = express.Router();
const {addNewUser,loginuser,getUserDetails,forgotPassword,verifyOtp,resetPassword,
    uploadImage} = require("../controllers/user");

app.post("/register",addNewUser)
app.post("/login",loginuser)
app.get("/get-user",userauth,getUserDetails)
app.post('/forgot-password',forgotPassword)
app.post('/verify-otp',verifyOtp)
app.post('/reset-password', resetPassword);


app.post("/upload-image",userauth,uploadImage)



module.exports=app