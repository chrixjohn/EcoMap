const Upload=require("../../models/uploadModel")
 async function getUpload (req, res) {
    try {
      const data = await Upload.find(); // Query all data
      res.json(data);  // Send data as JSON response
    } catch (err) {
        console.log(err);
        
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
  
  
  

  module.exports={getUpload,getlistUpload,getUploadById}