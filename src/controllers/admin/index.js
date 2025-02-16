const {addNewAdmin, loginAdmin, getAdminDetails, updateAdmin, deleteAdmin, forgotPassword, verifyOtp, resetPassword} = require("./admin")
const {getExperts, updateExpert, deleteExpert} = require("./experts")
const {getUsers, updateUser, deleteUser} = require("./users")
const {species, updateSpecies,  deleteSpecies} = require("./species")

module.exports={addNewAdmin, loginAdmin, getAdminDetails, updateAdmin, deleteAdmin, forgotPassword, verifyOtp, resetPassword, 
    getExperts, updateExpert, deleteExpert, 
    getUsers, updateUser, deleteUser, 
    species, updateSpecies,  deleteSpecies};