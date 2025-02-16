const {addNewUser, loginuser, getUserDetails, updateUser, deleteUser, forgotPassword, verifyOtp, resetPassword}=require('./user');
const{uploadImage, updateUpload, deleteUpload, getUserUploads, getUploadHistory, getPendingList, getPendingData, }=require("./upload")
const {getGeoJSONData}=require("./heatmap")

module.exports={addNewUser, loginuser, getUserDetails, updateUser, deleteUser, forgotPassword, verifyOtp, resetPassword, 
    uploadImage, updateUpload, deleteUpload, getUserUploads,  getUploadHistory, getPendingList, getPendingData, 
    getGeoJSONData};