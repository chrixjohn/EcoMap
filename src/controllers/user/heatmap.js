const Occurrence = require("../../models/occurenceModel"); // Adjust the path to your Upload model

// Route to fetch and send data as GeoJSON
async function getGeoJSONData(req, res) {
  try {
    // Fetch occurrences and populate all referenced fields
    const occurrences = await Occurrence.find()
      .populate("spotId") // Populate spotId to access location
      .populate("speciesId") // Populate species details
      .populate("userId") // Populate user details
      .populate("expertId"); // Populate expert details

    if (!occurrences || occurrences.length === 0) {
      return res.status(404).json({ error: "No occurrences found" });
    }

    // Format data as GeoJSON FeatureCollection
    const geoJSON = {
      type: "FeatureCollection",
      features: occurrences
        .map((occurrence) => {
          const {
            spotId,
            speciesId,
            userId,
            expertId,
            _id,
            createdAt,
            updatedAt,
          } = occurrence;

          // Ensure spotId and its location exist
          if (!spotId || !spotId.location) {
            return null;
          }

          return {
            type: "Feature",
            geometry: spotId.location, // Geometry from spotId's location
            properties: {
              occurenceid: _id,

              speciesId: speciesId ? speciesId._id : null, // Species ID
              speciesCommonName: speciesId ? speciesId.common_name : null, // Common name from species
              scientificName: speciesId ? speciesId.scientific_name : null, // Scientific name from species
              taxonomyClass: speciesId ? speciesId.taxonomy_class : null, // Taxonomy class from species
              conservationStatus: speciesId
                ? speciesId.conservation_status
                : null, // Conservation status from species
              speciesImage: speciesId ? speciesId.image : null, // Species image URL

              userId: userId ? userId._id : null, // User ID
              userName: userId ? userId.name : null, // User name
              userEmail: userId ? userId.email : null, // User email
              userProfilePic: userId ? userId.profilepic : null, // User profile picture

              expertId: expertId ? expertId._id : null, // Expert ID
              expertName: expertId ? expertId.name : null, // Expert name
              expertEmail: expertId ? expertId.email : null, // Expert email

              spotId: spotId ? spotId._id : null, // Spot ID
              spotTitle: spotId ? spotId.title : null, // Spot title
              spotDescription: spotId ? spotId.description : null, // Spot description
              spotImage: spotId ? spotId.image : null, // Spot image URL
              spotLocation: spotId ? spotId.location : null, // Spot location
              spotStatus: spotId ? spotId.status : null, // Spot status
              spotDate: spotId ? spotId.date : null, // Spot date

              createdAtOccurrence: createdAt,
              updatedAtOccurrence: updatedAt,
            },
          };
        })
        .filter((feature) => feature !== null), // Filter out invalid features
    };

    // Send GeoJSON response
    res.status(200).json(geoJSON);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getGeoJSONData };
