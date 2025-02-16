const cloudinary = require('../../config/cloudinary');
const Upload = require('../../models/uploadModel');

const fs = require('fs'); // To remove files after upload




async function uploadImage(req, res) {
  const { title, description } = req.body;
  const location = {
  type: req.body['location.type'],
  coordinates: req.body['location.coordinates'].map(Number), // Convert to numbers
};

  // Validate input
  if (!req.file) {
    return res.status(401).json({ error: 'File is required' });
  }
  
  if (!title) {
    return res.status(401).json({ error: 'Title is required' });
  }
  
  if (!description) {
    return res.status(401).json({ error: 'Description is required' });
  }
  
  

  try {
    const user = req.user; // Retrieved from middleware
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    // Upload file to Cloudinary directly from memory
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'uploads' }, // Specify folder in Cloudinary
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer); // Pipe the buffer to Cloudinary
    });

    // Create a new upload document in MongoDB
    const newUpload = new Upload({
      image: result.secure_url, // Cloudinary URL
      title,
      description,
      location,
      user: user.id,
    });

    await newUpload.save();

    // const uploads = await Upload.find({ user: user.id }).populate('user', 'name email');

    res.status(201).json({
      message: 'Image uploaded successfully!',
      upload: newUpload,
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}


// async function uploadImage(req, res) {
//   const { title, description, location } = req.body;

//   // Validate the input
//   if (!req.file || !title || !description || !location) {
//     return res.status(401).json({ error: 'All fields are required' });
//   }

//   try {
//     // Check if the user is authenticated
//     const user = req.user; // Retrieved from middleware
//     if (!user) {
//       return res.status(401).json({ error: 'Unauthorized.' });
//     }

//     // Upload the image to Cloudinary without forcing a format change
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: 'uploads',
//       resource_type: 'image', // Ensure it's treated as an image
//     });
//     console.log("Cloudinary result:", result);

//     // Remove the temporary file
//     fs.unlinkSync(req.file.path);

//     // Create a new upload document with the Cloudinary URL (original format)
//     const newUpload = new Upload({
//       image: result.secure_url, // Cloudinary URL with original format (e.g., .png, .jpg)
//       title,
//       description,
//       location,
//       user: user.id,
//     });

//     // Save the upload document to the database
//     await newUpload.save();

//     const uploads = await Upload.find({ user: user.id }).populate('user', 'name email');

//     // Send success response
//     res.status(201).json({
//       message: 'Image uploaded successfully!',
//       upload: newUpload,
//       total:uploads
      
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// }

async function updateUpload(req, res) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const user = req.user; // Retrieved from middleware
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    
    const updatedUpload = await Upload.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    );
    
    if (!updatedUpload) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    res.status(200).json(updatedUpload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete upload
async function deleteUpload(req, res) {
  try {
    const { id } = req.params;
    const user = req.user; // Retrieved from middleware
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    const deletedUpload = await Upload.findByIdAndDelete(id);
    if (!deletedUpload) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    res.status(200).json({ message: 'Upload deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUserUploads(req, res) {
    const user = req.user; // Retrieved from middleware
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
  
    try {
      const uploads = await Upload.find({ user: user.id });
      res.status(200).json(uploads);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch uploads.' });
    }
  }


  async function getUploadHistory(req, res) {
    try {
        const userId = req.user.id;
        const uploads = await Upload.find({ user: userId, status: { $in: ['approved', 'declined'] } });
        const user = req.user; // Retrieved from middleware
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
        
        const formattedUploads = uploads.map(upload => ({
            uploadID: upload._id,
            status: upload.status,
            name: upload.title,
            date: upload.date
        }));

        res.json(formattedUploads);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get pending uploads
async function getPendingList(req, res) {
    try {
        const userId = req.user.id;
        const uploads = await Upload.find({ user: userId, status: 'waiting' });
        const user = req.user; // Retrieved from middleware
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
        
        const pendingUploads = uploads.map(upload => ({
            uploadID: upload._id,
            name: upload.title,
            date: upload.date
        }));

        res.json(pendingUploads);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get full data of a pending upload
async function getPendingData(req, res) {
    try {
        const { uploadID } = req.body;
        const user = req.user; // Retrieved from middleware
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
        const upload = await Upload.findById(uploadID);

        if (!upload) {
            return res.status(404).json({ error: 'Upload not found' });
        }

        res.json({
            uploadID: upload._id,
            image: upload.image,
            date: upload.date,
            location: upload.location
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = { uploadImage,updateUpload,deleteUpload,getUserUploads,getUploadHistory,getPendingList,getPendingData };



