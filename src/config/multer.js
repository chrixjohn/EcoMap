const multer = require('multer');
const path = require('path');



// Use Multer for in-memory storage
const storage = multer.memoryStorage(); // Store file in memory
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};
const upload = multer({ storage,fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });







// Set up storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Temporary folder to store files
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// // File filter for image types
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
// });

module.exports = upload;
