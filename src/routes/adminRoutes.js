const express = require("express");
const adminauth = require("../middlewares/adminauth");
const app = express.Router();
const {
    getExperts,
    getUsers,
    addNewAdmin,
    loginAdmin,
    getAdminDetails,
    forgotPassword,
    verifyOtp,
    resetPassword,
} = require("../controllers/admin");
const { getSpecies } = require("../controllers/admin/species");

app.post("/register", addNewAdmin);
app.post("/login", loginAdmin);
app.get("/get-user", adminauth, getAdminDetails);
app.post("/forgot-password", forgotPassword);
app.post("/verify-otp", verifyOtp);
app.post("/reset-password", resetPassword);

app.get("/experts", adminauth, getExperts);
app.get("/users", adminauth, getUsers);
app.get("/species", adminauth, getSpecies);

module.exports = app;
