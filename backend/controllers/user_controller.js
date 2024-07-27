let User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const upload = require('../middlewear/upload');
let dotenv = require('dotenv');


dotenv.config({path: './config.env'});

exports.createUser = async (req, res) => {
    try {
        // Extract name, email, and password from request body
        const { name, email, password } = req.body;

        // Check if the email or username already exists in the database
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                status: "fail",
                message: "Email already exists"
            });
        }

        const existingName = await User.findOne({ name });
        if (existingName) {
            return res.status(400).json({
                status: "fail",
                message: "Username already exists"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // Hash with salt rounds of 10

        // Create a new user with name, email, and hashed password
        const newUser = await User.create({ name, email, password: hashedPassword });

        // Respond with success message and user data
        res.status(201).json({
            status: "success",
            data: {
                user: newUser
            }
        });
    } catch (error) {
        // Handle error
        res.status(500).json({
            status: "fail",
            message: `Error creating user: ${error.message}`
        });
    }
};

exports.getAllUsers = async (req, res)=>{
    try{
        let users = await User.find();
        res.status(200).json({
            status:"successful",
            data:{
                users
            }
        })
    }
    catch(error){
        res.status(404).json({
            status:"fail",
            message:`error getting users: ${error}`
        })
    }
}

exports.getCurrentUser = async (req, res) => {
    try {
        // Extract the token from the request's Authorization header
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify the token to get the user's ID
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Failed to authenticate token' });
            }

            // Find the user in the database based on the decoded user ID
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Return the user details as a response
            res.status(200).json({ user });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Controller function to update user comments by name
exports.updateUserByName = async (req, res) => {
    try {
        // Attempt to find and update user by name using mongoose's findOneAndUpdate method
        let user = await User.findOneAndUpdate(
            { name: req.params.name }, // Find user by name parameter in the request
            { 
                $push: { 
                    // Push new comments into respective arrays based on request body
                    professor_comments: req.body.professor_comments,
                    living_comments: req.body.living_comments,
                    experience_comments: req.body.experience_comments
                } 
            },
            { new: true, runValidators: true } // Options: return updated document and run validators
        );

        // If user is not found, return a 404 response
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        // If update is successful, return a 200 response with updated user data
        res.status(200).json({
            status: "successful",
            data: {
                user
            }
        });
    } catch (error) {
        // Handle any errors that occur during the update process
        res.status(404).json({
            status: "fail",
            message: `Error updating user: ${error}` // Return error message in case of failure
        });
    }
};
// user_controller.js
exports.updateUsername = async (req, res) => {
    try {
        const { newUsername } = req.body;
        const userId = req.params.userId;

        // Check if the new username already exists in the database
        const existingUser = await User.findOne({ name: newUsername });
        if (existingUser) {
            return res.status(400).json({
                status: "fail",
                message: "Username already exists"
            });
        }

        // Update the username
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { name: newUsername } },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: `Error updating username: ${error.message}`
        });
    }
};


exports.updateUserBio = async (req, res) => {
    try {
        // Update the user bio using findByIdAndUpdate
        let user = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: { bio: req.body.bio } }, // Set the bio field to req.body.bio
            { new: true, runValidators: true } // Options: return updated document and run validators
        );
        
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                user
            }
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: `Error updating user: ${error.message}` // Return error message in case of failure
        });
    }
};


// controllers/authController.js
// Controller function to handle user login
exports.loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ status: "fail", error: "User does not exist" });
        }
        const match = await bcrypt.compare(password, user.password);
        let secret = process.env.SECRET;
        if (match) {
            const token = jwt.sign({ id: user._id, name: user.name }, secret, { expiresIn: '2h' });
            return res.status(200).json({ status: "success", message: 'Login successful', token });
        } else {
            return res.status(401).json({ status: "fail", error: "Incorrect password" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", error: "Internal Server Error" });
    }
};

/**z
 * Middleware function to handle image upload for a specific user.
 * Uses multer middleware to process file upload, saves file path to user document in database.
 * Responds with appropriate status codes and messages based on upload and database operations.
 * @param {Object} req - Express request object containing file to upload and user ID in parameters.
 * @param {Object} res - Express response object to send JSON response.
 */
exports.uploadUserImage = (req, res) => {
    // Utilize multer middleware 'upload' to handle file upload
    upload(req, res, (err) => {
        if (err) {
            // If upload error occurs, respond with 400 status and error message
            return res.status(400).json({ msg: err });
        }
        if (!req.file) {
            // If no file was uploaded, respond with 400 status and message
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Find user by ID in database using request parameters
        User.findById(req.params.userId)
            .then(user => {
                if (!user) {
                    // If user with provided ID not found, respond with 404 status and message
                    return res.status(404).json({ msg: 'User not found' });
                }

                // Push uploaded file path to 'images' array in user document
                user.images.push(req.file.path);

                // Save updated user document
                return user.save();
            })
            .then(user => 
                // Respond with JSON containing updated user document on successful save
                res.json(user)
            )
            .catch(err => 
                // If error occurs during database operation, respond with 500 status and error details
                res.status(500).json({ error: 'Failed to save image', details: err })
            );
    });
};

exports.updateUserEmail = async (req, res) => {
    try {
        const { newEmail } = req.body;
        const userId = req.params.userId;

        // Check if the new email already exists in the database
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({
                status: "fail",
                message: "Email already exists"
            });
        }

        // Update the email
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { email: newEmail } },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: `Error updating email: ${error.message}`
        });
    }
};

exports.updateUserPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;
        const userId = req.params.userId;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: "fail",
                message: "Passwords do not match"
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the password in the database
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { password: hashedPassword } },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: `Error updating password: ${error.message}`
        });
    }
};

exports.updateUserCampus = async (req, res) => {
    try {
        const { campus } = req.body;
        const userId = req.params.userId;

        // Update the campus
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { campus: campus } },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: `Error updating campus: ${error.message}`
        });
    }
};
