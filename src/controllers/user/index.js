const {addNewUser,loginuser,getUserDetails,forgotPassword,verifyOtp,resetPassword}=require('./user');
const{uploadImage,getUserUploads}=require("./upload")
const {getGeoJSONData}=require("./heatmap")

module.exports={addNewUser,loginuser,getUserDetails,forgotPassword,verifyOtp,resetPassword,
    uploadImage,getUserUploads,
    getGeoJSONData};