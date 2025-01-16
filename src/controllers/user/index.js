const {addNewUser,loginuser,getUserDetails,forgotPassword,verifyOtp,resetPassword}=require('./user');
const{uploadImage}=require("./upload")

module.exports={addNewUser,loginuser,getUserDetails,uploadImage,forgotPassword,verifyOtp,resetPassword};