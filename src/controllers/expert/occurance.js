const Occurrence = require("../../models/occurenceModel")
const Upload = require("../../models/uploadModel")


async function saveOccurrence(req, res) {
    const { spotId,  speciesId, userId } = req.body;
  
    try {
        const user = req.user;
        console.log("user",user);
        
        
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }
      const newOccurrence = new Occurrence({
        spotId,
        
        speciesId,
        
        userId,
        
        expertId:user.id,
        
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
        .populate('spotId')
        .populate('speciesId')
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
  async function getOccurrence(req, res) {
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
  
  module.exports = {saveOccurrence, getOccurrenceById,getOccurrence };
  