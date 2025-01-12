const Upload=require("../../models/uploadModel")

 async function uploadImage (req, res)  {
    const { image, title, description, location } = req.body;
  
    // Validate the input
    if (!image || !title || !description || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    try {
      // Check if the user is authenticated
      const user = req.user;
      console.log(user);
       // Retrieved from middleware
      if (!user) {
          return res.status(401).json({ error: 'Unauthorized.' });
      }
      
  
    
      // Create a new upload document
      const newUpload = new Upload({
        image,
        title,
        description,
        location,
        user: user.id,
      });
      console.log(newUpload);
      
      // Save the upload document to the database
      await newUpload.save();
      const uploads = await Upload.find({user: user.id}).populate('user', 'name email');
      console.log("populate",uploads);
  
      // Send success response
      res.status(201).json({ message: 'Image uploaded successfully!', upload: newUpload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' ,error});
    }
  };

  module.exports={uploadImage}