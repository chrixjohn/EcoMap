const express = require("express");
const userauth = require("../middlewares/userauth");
const app = express.Router();
const upload = require("../config/multer");
const {
  addNewUser,
  loginuser,
  getUserDetails,
  updateUser,
  deleteUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  uploadImage,
  updateUpload,
  deleteUpload,
  getUserUploads,
  getUploadHistory,
  getPendingList,
  getPendingData,
  getGeoJSONData,
} = require("../controllers/user");

app.post("/register", addNewUser);
app.post("/login", loginuser);
app.get("/get-user", userauth, getUserDetails);
app.put("/update-user", userauth, upload.single("profilepic"), updateUser);
app.delete("/delete-user", userauth, deleteUser);
app.post("/forgot-password", forgotPassword);
app.post("/verify-otp", verifyOtp);
app.post("/reset-password", resetPassword);

app.post("/upload-image", userauth, upload.single("image"), uploadImage);
app.get("/uploads", userauth, getUserUploads);
app.put("/upload/:id", userauth, updateUpload);
app.delete("/upload/:id", userauth, deleteUpload);
app.post("/upload-history", userauth, getUploadHistory);
app.post("/pending-list", userauth, getPendingList);
app.post("/pending-data", userauth, getPendingData);

app.get("/map", getGeoJSONData);

module.exports = app;
