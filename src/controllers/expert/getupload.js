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
      // Query and select only _id and image fields
      const data = await Upload.find({}, 'image _id');  // Select only image and _id fields
      
      // Send the selected data as JSON response
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