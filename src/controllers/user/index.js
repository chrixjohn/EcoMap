const {addNewUser,loginuser,getUserDetails,forgotPassword,verifyOtp,resetPassword}=require('./user');
const{uploadImage,getUserUploads,getUploadHistory,getPendingList,getPendingData,}=require("./upload")
const {getGeoJSONData}=require("./heatmap")

module.exports={addNewUser,loginuser,getUserDetails,forgotPassword,verifyOtp,resetPassword,
    uploadImage,getUserUploads, getUploadHistory,getPendingList,getPendingData,
    getGeoJSONData};