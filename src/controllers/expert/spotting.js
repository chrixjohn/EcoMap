const Upload=require("../../models/uploadModel")
 async function getUpload (req, res) {
    try {
      const data = await Upload.find(); // Query all data
      res.json(data);  // Send data as JSON response
    } catch (err) {
    
      res.status(500).json({ error: 'Failed to retrieve data',err });
    }
  };


  async function getlistUpload(req, res) {
    try {
      // Query where status is 'waiting' and select specific fields
      const data = await Upload.find({ status: 'waiting' }, 'image _id title');
  
      // Send the filtered data as JSON response
      res.json(data);
    } catch (err) {
      // Handle errors and send error response
      res.status(500).json({ error: 'Failed to retrieve data' });
    }
  }


  async function getUploadById(req, res) {
    const { id } = req.params;
  
    try {
      const upload = await Upload.findById(id).populate('user', 'name email');
      
      if (!upload) {
        return res.status(404).json({ message: 'Upload not found' });
      }
      res.json(upload);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving upload details', error });
    }
  }

  async function saveUpload(req, res) {
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
        
        expertId:user.id,
        
      });
  
      await newOccurrence.save();
      await Upload.findByIdAndUpdate(spotId, { status: 'approved' });
      res.status(201).json({ message: 'Occurrence saved successfully', occurrence: newOccurrence });
    } catch (error) {
      res.status(500).json({ message: 'Error saving occurrence', error });
    }
  }
  
  async function rejectUpload(req, res) {
    const { spotId } = req.body;
  
    try {
        const user = req.user;
       
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }
      await Upload.findByIdAndUpdate(spotId, { status: 'declined' });
      res.status(201).json({ message: 'Upload rejected successfully' });
      
    } catch (error) {
      res.status(500).json({ message: 'Error saving occurrence', error });
    }
  }
  
  
  

  module.exports={getUpload,getlistUpload,getUploadById,saveUpload,rejectUpload}