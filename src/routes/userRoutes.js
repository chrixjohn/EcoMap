const express = require("express");
const userauth = require("../middlewares/userauth");
const app = express.Router();
const upload = require("../config/multer");
const {addNewUser, loginuser, getUserDetails, forgotPassword, verifyOtp, resetPassword, 
    uploadImage, getUserUploads, getUploadHistory, getPendingList, getPendingData, 
    getGeoJSONData} = require("../controllers/user");

app.post("/register", addNewUser)
app.post("/login", loginuser)
app.get("/get-user", userauth, getUserDetails)
app.post('/forgot-password', forgotPassword)
app.post('/verify-otp', verifyOtp)
app.post('/reset-password',  resetPassword);

app.post("/upload-image", userauth, upload.single('image'), uploadImage)
app.get("/uploads", userauth, getUserUploads)
app.post('/upload-history', userauth, getUploadHistory);
app.post('/pending-list', userauth, getPendingList);
app.post('/pending-data', userauth, getPendingData);

app.get('/map',  getGeoJSONData);



module.exports=app