const Occurrence = require("../../models/occurenceModel");

async function getGeoJSONData(req, res) {
  try {
    const occurrences = await Occurrence.find()
      .populate("spotId")
      .populate("speciesId")
      .populate("userId")
      .populate("expertId");

    if (!occurrences || occurrences.length === 0) {
      return res.status(404).json({ error: "No occurrences found" });
    }

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

          if (!spotId || !spotId.location) {
            return null;
          }

          return {
            type: "Feature",
            geometry: spotId.location,
            properties: {
              occurenceid: _id,

              speciesId: speciesId ? speciesId._id : null,
              speciesCommonName: speciesId ? speciesId.common_name : null,
              scientificName: speciesId ? speciesId.scientific_name : null,
              taxonomyClass: speciesId ? speciesId.taxonomy_class : null,
              conservationStatus: speciesId
                ? speciesId.conservation_status
                : null,
              speciesImage: speciesId ? speciesId.image : null,

              userId: userId ? userId._id : null,
              userName: userId ? userId.name : null,
              userEmail: userId ? userId.email : null,
              userProfilePic: userId ? userId.profilepic : null,

              expertId: expertId ? expertId._id : null,
              expertName: expertId ? expertId.name : null,
              expertEmail: expertId ? expertId.email : null,

              spotId: spotId ? spotId._id : null,
              spotTitle: spotId ? spotId.title : null,
              spotDescription: spotId ? spotId.description : null,
              spotImage: spotId ? spotId.image : null,
              spotLocation: spotId ? spotId.location : null,
              spotStatus: spotId ? spotId.status : null,
              spotDate: spotId ? spotId.date : null,

              createdAtOccurrence: createdAt,
              updatedAtOccurrence: updatedAt,
            },
          };
        })
        .filter((feature) => feature !== null),
    };

    res.status(200).json(geoJSON);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function speciesMap(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "speciesId parameter is required" });
    }
    const speciesId = id;

    const occurrences = await Occurrence.find({ speciesId })
      .populate("spotId")
      .populate("speciesId")
      .populate("userId")
      .populate("expertId");

    if (!occurrences || occurrences.length === 0) {
      return res.status(404).json({ error: "No occurrences found" });
    }

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

          if (!spotId || !spotId.location) {
            return null;
          }

          return {
            type: "Feature",
            geometry: spotId.location,
            properties: {
              occurenceid: _id,

              speciesId: speciesId ? speciesId._id : null,
              speciesCommonName: speciesId ? speciesId.common_name : null,
              scientificName: speciesId ? speciesId.scientific_name : null,
              taxonomyClass: speciesId ? speciesId.taxonomy_class : null,
              conservationStatus: speciesId
                ? speciesId.conservation_status
                : null,
              speciesImage: speciesId ? speciesId.image : null,

              userId: userId ? userId._id : null,
              userName: userId ? userId.name : null,
              userEmail: userId ? userId.email : null,
              userProfilePic: userId ? userId.profilepic : null,

              expertId: expertId ? expertId._id : null,
              expertName: expertId ? expertId.name : null,
              expertEmail: expertId ? expertId.email : null,

              spotId: spotId ? spotId._id : null,
              spotTitle: spotId ? spotId.title : null,
              spotDescription: spotId ? spotId.description : null,
              spotImage: spotId ? spotId.image : null,
              spotLocation: spotId ? spotId.location : null,
              spotStatus: spotId ? spotId.status : null,
              spotDate: spotId ? spotId.date : null,

              createdAtOccurrence: createdAt,
              updatedAtOccurrence: updatedAt,
            },
          };
        })
        .filter((feature) => feature !== null),
    };

    res.status(200).json(geoJSON);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getGeoJSONData, speciesMap };
