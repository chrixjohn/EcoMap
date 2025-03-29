const express = require("express");
const adminauth = require("../middlewares/adminauth");
const upload = require("../config/multer");
const app = express.Router();
const {
  addNewAdmin,
  loginAdmin,
  getAdminDetails,
  updateAdmin,
  deleteAdmin,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getExperts,
  updateExpert,
  deleteExpert,
  getUsers,
  pendingUsers,
  approveUser,
  rejectUser,
  updateUser,
  deleteUser,
  species,
  addSpecies,
  updateSpecies,
  deleteSpecies,
} = require("../controllers/admin");

app.post("/register", addNewAdmin);
app.post("/login", loginAdmin);
app.get("/get-admin", adminauth, getAdminDetails);
app.put("/update-admin", adminauth, upload.single("profilepic"), updateAdmin);
app.delete("/delete-admin", adminauth, deleteAdmin);
app.post("/forgot-password", forgotPassword);
app.post("/verify-otp", verifyOtp);
app.post("/reset-password", resetPassword);

app.get("/experts", adminauth, getExperts);
app.put("/expert/:id", adminauth, updateExpert);
app.delete("/expert/:id", adminauth, deleteExpert);

app.get("/users", adminauth, getUsers);
app.get("/pending-users", adminauth, pendingUsers);
app.put("/user/:id/approve", adminauth, approveUser);
app.put("/user/:id/reject", adminauth, rejectUser);
app.put("/user/:id", adminauth, updateUser);
app.delete("/user/:id", adminauth, deleteUser);

app.get("/species", adminauth, species);
app.post("/add-species", adminauth, upload.single("image"), addSpecies);
app.put("/species/:id", adminauth, updateSpecies);
app.delete("/species/:id", adminauth, deleteSpecies);

module.exports = app;
