const {
  addNewExpert,
  loginexpert,
  getExpertDetails,
  updateExpert,
  deleteExpert,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("./expert");
const {
  getUpload,
  getlistUpload,
  getUploadById,
  saveUpload,
  rejectUpload,
} = require("./spotting");
const {
  addSpecies,
  getSpecies,
  getSpeciesById,
  updateSpecies,
  deleteSpecies,
} = require("./species");
const {
  getOccurrencesOfExpert,
  getOccurrence,
  getOccurrenceById,
  updateOccurrence,
  deleteOccurrence,
} = require("./occurance");
const { countAllDocuments } = require("./count");
const { getGeoJSONData, speciesMap } = require("./heatmap");

module.exports = {
  addNewExpert,
  loginexpert,
  getExpertDetails,
  updateExpert,
  deleteExpert,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getUpload,
  getlistUpload,
  getUploadById,
  saveUpload,
  rejectUpload,
  addSpecies,
  getSpecies,
  getSpeciesById,
  updateSpecies,
  deleteSpecies,
  getOccurrencesOfExpert,
  getOccurrence,
  getOccurrenceById,
  updateOccurrence,
  deleteOccurrence,
  countAllDocuments,
  getGeoJSONData,
  speciesMap,
};
