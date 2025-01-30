const Species = require('../../models/speciesModel');
const Occurrence = require('../../models/occurenceModel');

async function searchSpecies(req, res) {
    try {
      const { common_name } = req.query; // Get the search term from the query parameter
      
      if (!common_name) {
        return res.status(400).json({ message: "Please provide a common name to search." });
      }
  
      // Perform a case-insensitive search using a regular expression for substring match
      const species = await Species.find({
        common_name: { $regex: common_name, $options: "i" } // 'i' for case-insensitive search
      });
  
      if (species.length === 0) {
        return res.status(404).json({ message: "No species found matching the common name." });
      }
  
      res.status(200).json(species); // Return the matching species
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  

  // Filter by conservation_status
 async function filterByConservationStatus (req, res) {
    try {
      const { conservation_status } = req.query;
      if (!conservation_status) {
        return res.status(400).json({ message: "conservation_status query parameter is required" });
      }
  
      const species = await Species.find({ conservation_status });
      res.status(200).json(species);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Sort by common_name (A-Z or Z-A)
 async function sortSpecies (req, res) {
    try {
      const { sort } = req.query;
  
      const sortOption = {};
      if (sort === "asc") {
        sortOption.common_name = 1; // A-Z
      } else if (sort === "desc") {
        sortOption.common_name = -1; // Z-A
      } else {
        return res.status(400).json({ message: "Invalid sort option. Use 'asc' or 'desc'." });
      }
  
      const species = await Species.find().sort(sortOption);
      res.status(200).json(species);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  async function filterSpecies(req, res) {
    try {
        const { searchTerm, conservationStatus, sortBy } = req.query;
        console.log(req.query);
        const query = {};
        const sortOption = {};

        if (searchTerm) {
            query.common_name = { $regex: searchTerm, $options: "i" };
        }

        if (conservationStatus) {
            query.conservation_status = conservationStatus;
        }

        if (sortBy === "asc") {
            sortOption.common_name = 1; // A-Z
        } else if (sortBy === "desc") {
            sortOption.common_name = -1; // Z-A
        }

        const species = await Species.find(query).sort(sortOption);

        if (species.length === 0) {
            return res
                .status(200)
                .json({ message: "No species found matching the criteria." });
        }

        res.status(200).json(species);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving species", error});
    } 
}


  async function filterOccurrences(req, res) {
    try {
        const { searchTerm, startDate, endDate, sortBy } = req.query;
        const query = {};

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const sortOption = {};
        if (sortBy == "recent") {
            sortOption.createdAt = -1;
        } else if (sortBy == "oldest") {
            sortOption.createdAt = 1;
        }

        const occurrences = await Occurrence.find(query)
            .populate({
                path: "spotId",
                select: "image",
            })
            .populate({
                path: "speciesId",
                select: "common_name",
                match: searchTerm
                    ? { common_name: { $regex: searchTerm, $options: "i" } }
                    : null,
            })
            .sort(sortOption)
            .exec();

        const filteredOccurrences = occurrences.filter(
            (o) => o.speciesId !== null
        );

        if (filteredOccurrences.length === 0) {
            return res.status(200).json({
                message: "No occurrences found matching the criteria.",
            });
        }

        res.status(200).json(filteredOccurrences);
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving occurrence details",
            error,
        });
    } 
}



  module.exports = { searchSpecies, filterByConservationStatus, sortSpecies, filterSpecies, filterOccurrences };