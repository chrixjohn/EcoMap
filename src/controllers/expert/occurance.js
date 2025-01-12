const Occurrence = require("../../models/occurenceModel")
const Upload = require("../../models/uploadModel")


async function saveOccurrence(req, res) {
    const { spotId,  speciesId, userId } = req.body;
  
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }
      const newOccurrence = new Occurrence({
        spotId,
        
        speciesId,
        
        userId,
        
        expertId:user._id,
        
      });
  
      await newOccurrence.save();
      await Upload.findByIdAndUpdate(spotId, { status: 'approved' });
      res.status(201).json({ message: 'Occurrence saved successfully', occurrence: newOccurrence });
    } catch (error) {
      res.status(500).json({ message: 'Error saving occurrence', error });
    }
  }
  
  module.exports = { saveOccurrence };
  

async function getOccurrenceById(req, res) {
    const { id } = req.params;
  
    try {
      const occurrence = await Occurrence.findById(id)
        .populate('spotId', 'title description location status user date ')
        .populate('speciesId', 'common_name scientific_name taxonomy_class conservation_status')
        .populate('userId', 'name email')
        .populate('expertId', 'name email');
      
      if (!occurrence) {
        return res.status(404).json({ message: 'Occurrence not found' });
      }
      res.json(occurrence);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving occurrence details', error });
    }
  }
  
  module.exports = {saveOccurrence, getOccurrenceById };
  