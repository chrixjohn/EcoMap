const Species = require("../../models/speciesModel");
const cloudinary = require("../../config/cloudinary");

async function species(req, res) {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Unauthorized." });
        }
        const species = await Species.find();
        res.status(200).json(species);
    } catch (error) {
        res.status(500).json({ message: "Error fetching species", error });
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
    try {
      const { id } = req.params;
      const updates = req.body;
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }
      
      const updatedSpecies = await Species.findByIdAndUpdate(id, updates, { new: true });
      
      if (!updatedSpecies) {
        return res.status(404).json({ message: 'Species not found' });
      }
  
      res.status(200).json(updatedSpecies);
    } catch (error) {
      res.status(500).json({ message: 'Error updating species', error });
    }
  }
  
  // Delete species
  async function deleteSpecies(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }
      
      const deletedSpecies = await Species.findByIdAndDelete(id);
      
      if (!deletedSpecies) {
        return res.status(404).json({ message: 'Species not found' });
      }
  
      res.status(200).json({ message: 'Species deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting species', error });
    }
  }
  
  

module.exports = { species, addSpecies, updateSpecies, deleteSpecies };