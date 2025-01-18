const cloudinary = require('../../config/cloudinary');
const Upload = require('../../models/uploadModel');

const fs = require('fs'); // To remove files after upload

async function uploadImage(req, res) {
  const { title, description, location } = req.body;

  // Validate the input
  if (!req.file || !title || !description || !location) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if the user is authenticated
    const user = req.user; // Retrieved from middleware
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    // Upload the image to Cloudinary without forcing a format change
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads',
      resource_type: 'image', // Ensure it's treated as an image
    });
    console.log("Cloudinary result:", result);

    // Remove the temporary file
    fs.unlinkSync(req.file.path);

    // Create a new upload document with the Cloudinary URL (original format)
    const newUpload = new Upload({
      image: result.secure_url, // Cloudinary URL with original format (e.g., .png, .jpg)
      title,
      description,
      location,
      user: user.id,
    });

    // Save the upload document to the database
    await newUpload.save();

    const uploads = await Upload.find({ user: user.id }).populate('user', 'name email');

    // Send success response
    res.status(201).json({
      message: 'Image uploaded successfully!',
      upload: newUpload,
      total:uploads
      
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
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   try {
//     // Check if the user is authenticated
//     const user = req.user; // Retrieved from middleware
//     if (!user) {
//       return res.status(401).json({ error: 'Unauthorized.' });
//     }

//     // Log the buffer to verify it exists
//     console.log(req.file.buffer);

//     // Upload the image to Cloudinary using the buffer directly
//     const result = await cloudinary.uploader.upload_stream(
//       { resource_type: 'image', folder: 'uploads' },
//       (error, result) => {
//         if (error) {
//           return res.status(500).json({ error: 'Cloudinary upload failed', details: error.message });
//         }

//         // Save the result (Cloudinary URL) to the database or handle it
//         const newUpload = {
//           image: result.secure_url, // Cloudinary URL of the uploaded image
//           title,
//           description,
//           location,
//           user: user.id,
//         };

//         // You can now save the new upload to your database
//         // For example: await Upload.create(newUpload);

//         // Respond with the image URL and other metadata
//         res.status(201).json({
//           message: 'Image uploaded successfully!',
//           upload: newUpload,
//         });
//       }
//     );

//     // Stream the buffer to Cloudinary
//     req.file.stream.pipe(result);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// }

module.exports = { uploadImage };



