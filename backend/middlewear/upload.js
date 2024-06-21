// Import necessary modules
const multer = require('multer'); // Multer for handling file uploads
const path = require('path');     // Path module for file path operations

// Configure storage settings for multer
const storage = multer.diskStorage({
    destination: './uploads/', // Destination directory where files will be stored
    filename: (req, file, cb) => { // Function to define the filename of uploaded files
        cb(null, `${Date.now()}-${file.originalname}`); // Appends timestamp to original filename
    },
});

// Configure multer upload middleware with storage settings, file size limit, and file type filter
const upload = multer({
    storage: storage, // Set storage configuration for file saving
    limits: { fileSize: 5000000 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => { // Function to filter uploaded files based on file type
        const filetypes = /jpeg|jpg|png|gif/; // Accepted file types
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check file extension
        const mimetype = filetypes.test(file.mimetype); // Check file mimetype

        if (mimetype && extname) { // If file mimetype and extension match accepted types
            return cb(null, true); // Accept the file
        } else {
            cb('Error: Images Only!'); // Reject the file if not an accepted image type
        }
    },
}).single('image'); // Handle single file upload with field name 'image'

module.exports = upload; // Export configured multer upload middleware
