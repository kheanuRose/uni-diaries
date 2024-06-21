const jwt = require('jsonwebtoken'); // Importing the jsonwebtoken module for token verification
let dotenv = require('dotenv'); // Importing the dotenv module for loading environment variables

dotenv.config({ path: './config.env' }); // Loading environment variables from the config.env file

// Middleware function to verify the JWT token sent in the request header
const verifyToken = (req, res, next) => {
    // Extracting the token from the 'Authorization' header of the request
    const token = req.headers['authorization'];
    // Checking if the token exists
    if (!token) {
        // If token does not exist, return a 403 Forbidden error response
        return res.status(403).json({ error: 'No token provided' });
    }
    // Retrieving the secret key from the environment variables
    let secret = process.env.SECRET;
    // Verifying the token using the secret key
    jwt.verify(token, secret, (err, decoded) => {
        // If an error occurs during token verification
        if (err) {
            // Return a 500 Internal Server Error response
            return res.status(500).json({ error: 'Failed to authenticate token' });
        }
        // If token is successfully verified, extract user id and name from the decoded token
        req.userId = decoded.id; // Setting the userId property in the request object
        req.userName = decoded.name; // Setting the userName property in the request object
        // Move to the next middleware or route handler
        next();
    });
};

module.exports = verifyToken; // Exporting the verifyToken middleware function for use in other modules
