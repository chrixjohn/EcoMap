const Species = require('../../models/speciesModel');

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

  module.exports = { searchSpecies, filterByConservationStatus, sortSpecies };