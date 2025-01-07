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

  module.exports={getUpload,getlistUpload}