let mongoose = require('mongoose');

// Define the schema
let userschema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    confirmPassword: {
        type: String,
    },
    professor_comments: [{
        type: String
    }],
    living_comments: [{
        type: String
    }],
    experience_comments: [{
        type: String
    }],
    images: [{
        type: String
    }],
    bio:{
        type: String
    },
    campus:{
        type: String
    }
});

// Compile the model
let Usermodel = mongoose.model('User', userschema);

module.exports = Usermodel;
