const Species = require('../../models/speciesModel');

async function getSpecies(req, res) {
    try {
      const species = await Species.find();
      res.json(species);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving species', error });
    }
  }
  
  async function addSpecies(req, res) {
    const { common_name, scientific_name, taxonomy_class, conservation_status } = req.body;
  
    const newSpecies = new Species({
      common_name,
      scientific_name,
      taxonomy_class,
      conservation_status,
    });
  
    try {
      const savedSpecies = await newSpecies.save();
      res.status(201).json(savedSpecies);
    } catch (error) {
      res.status(400).json({ message: 'Error saving species', error });
    }
  }
  
  async function updateSpecies(req, res) {
    const { id } = req.params;
    const { common_name, scientific_name, taxonomy_class, conservation_status } = req.body;
  
    try {
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
  
    try {
      const species = await Species.findById(id);
      if (!species) return res.status(404).json({ message: 'Species not found' });
  
      await species.remove();
      res.json({ message: 'Species deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting species', error });
    }
  }
  
  module.exports = { getSpecies, addSpecies, updateSpecies, deleteSpecies };
  
  