const {getExperts} = require("./experts")
const {getUsers} = require("./users")
const {addNewAdmin,loginAdmin,getAdminDetails,forgotPassword,verifyOtp,resetPassword} = require("./admin")

module.exports={getExperts,getUsers,addNewAdmin,loginAdmin,getAdminDetails,forgotPassword,verifyOtp,resetPassword}