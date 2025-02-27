const {addNewAdmin, loginAdmin, getAdminDetails, updateAdmin, deleteAdmin, forgotPassword, verifyOtp, resetPassword} = require("./admin")
const {getExperts, updateExpert, deleteExpert} = require("./experts")
const {getUsers, approveUser, rejectUser, updateUser, deleteUser} = require("./users")
const {species, addSpecies, updateSpecies,  deleteSpecies} = require("./species")

module.exports={addNewAdmin, loginAdmin, getAdminDetails, updateAdmin, deleteAdmin, forgotPassword, verifyOtp, resetPassword, 
    getExperts, updateExpert, deleteExpert, 
    getUsers, approveUser, rejectUser, updateUser, deleteUser, 
    species, addSpecies, updateSpecies,  deleteSpecies};