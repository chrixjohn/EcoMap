const cloudinary = require('../../config/cloudinary');
const Species = require('../../models/speciesModel');

async function getSpecies(req, res) {
  try {
      const { searchTerm, conservationStatus, sortBy } = req.query;
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
      res.status(500).json({ message: "Error retrieving species", error });
  }
}

  async function getSpeciesById(req, res) {
    try {
      const speciesId = req.params.id;  // Get the species ID from the URL parameters
      const species = await Species.findById(speciesId);  // Find the species by ID
  
      if (!species) {
        return res.status(404).json({ message: 'Species not found' });
      }
  
      res.json(species);  // Return the species if found
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving species', error });
    }
  }
  
  
  
  async function addSpecies(req, res) {
    const { common_name, scientific_name, taxonomy_class, conservation_status } = req.body;
    const user = req.user;
    if (!req.file) {
      return res.status(401).json({ error: 'File is required' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    try {

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'species' }, // Specify folder in Cloudinary
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer); // Pipe the buffer to Cloudinary
    });
    const newSpecies = new Species({
      common_name,
      scientific_name,
      taxonomy_class,
      conservation_status,
      image:result.secure_url
    });
  
    
      const savedSpecies = await newSpecies.save();
      res.status(201).json(savedSpecies);
    } catch (error) {
      res.status(400).json({ message: 'Error saving species', error });
    }
  }
  
  async function updateSpecies(req, res) {
    const { id } = req.params;
    const { common_name, scientific_name, taxonomy_class, conservation_status } = req.body;
    const user = req.user;
  
    try {
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }
      const species = await Species.findById(id);
      if (!species) return res.status(404).json({ message: 'Species not found' });
  
      species.common_name = common_name || species.common_name;
      species.scientific_name = scientific_name || species.scientific_name;
      species.taxonomy_class = taxonomy_class || species.taxonomy_class;
      species.conservation_status = conservation_status || species.conservation_status;
  
      const updatedSpecies = await species.save();
      res.json(updatedSpecies);
    } catch (error) {
      res.status(400).json({ message: 'Error updating species', error });
    }
  }
  
  async function deleteSpecies(req, res) {
    const { id } = req.params;
    const user = req.user;
  
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
  
    try {
      const species = await Species.findById(id);
      if (!species) return res.status(404).json({ message: 'Species not found' });
  
      await species.remove();
      res.json({ message: 'Species deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting species', error });
    }
  }
  
  module.exports = { getSpecies, addSpecies, updateSpecies, deleteSpecies,getSpeciesById };
  
  