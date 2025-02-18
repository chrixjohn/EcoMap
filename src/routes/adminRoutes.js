const express = require("express");
const adminauth = require("../middlewares/adminauth");
const app = express.Router();
const {addNewAdmin, loginAdmin, getAdminDetails, updateAdmin, deleteAdmin, forgotPassword, verifyOtp, resetPassword, 
    getExperts, updateExpert, deleteExpert, 
    getUsers, updateUser, deleteUser, 
    species, addSpecies, updateSpecies, deleteSpecies} = require("../controllers/admin");

app.post("/register", addNewAdmin)
app.post("/login", loginAdmin)
app.get("/get-admin", adminauth, getAdminDetails)
app.put('/update-admin/:id', adminauth, updateAdmin);
app.delete('/delete-admin/:id', adminauth, deleteAdmin);
app.post('/forgot-password', forgotPassword)
app.post('/verify-otp', verifyOtp)
app.post('/reset-password', resetPassword);

app.get("/experts", adminauth, getExperts)
app.put('/expert/:id', adminauth, updateExpert);
app.delete('/expert/:id', adminauth, deleteExpert);

app.get("/users", adminauth , getUsers)
app.put('/user/:id', adminauth, updateUser);
app.delete('/user/:id', adminauth, deleteUser);

app.get("/species", adminauth, species)
app.post("/add-species", adminauth, addSpecies);
app.put('/species/:id', adminauth, updateSpecies);
app.delete('/species/:id', adminauth, deleteSpecies);

module.exports=app;