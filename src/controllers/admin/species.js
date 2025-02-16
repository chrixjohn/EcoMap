const Species = require("../../models/speciesModel");

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
  
  

module.exports = { species, updateSpecies, deleteSpecies };