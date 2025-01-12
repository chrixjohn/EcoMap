const {addNewExpert,loginexpert,getExpertDetails,forgotPassword,verifyOtp,resetPassword}=require('./expert');

const {getUpload,getlistUpload,getUploadById} = require('./getupload');

const {addSpecies, getSpecies, updateSpecies, deleteSpecies } = require('./species');

const {saveOccurrence, getOccurrenceById} = require("./occurance")

module.exports={addNewExpert,loginexpert,getExpertDetails,forgotPassword,verifyOtp,resetPassword,
    getUpload,getlistUpload,getUploadById,
    addSpecies, getSpecies, updateSpecies, deleteSpecies,
    saveOccurrence, getOccurrenceById };