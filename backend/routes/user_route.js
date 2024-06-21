let userController = require('../controllers/user_controller');
let express = require('express');
let verifyToken = require('../middlewear/veryifyToken')
let user_router = express.Router();

user_router.route('/')
            .get(verifyToken,userController.getAllUsers)
            .post(userController.createUser);

user_router.route('/currentUser')
            .get(verifyToken,userController.getCurrentUser);
            
user_router.route('/name/:name')
            .patch(verifyToken,userController.updateUserByName);

user_router.route('/login')
            .post(userController.loginuser);    

user_router.route('/upload/:userId')
            .post(verifyToken, userController.uploadUserImage);

user_router.route('/bio/:userId')
            .patch(verifyToken, userController.updateUserBio);

user_router.route('/updateUsername/:userId')
    .patch(verifyToken, userController.updateUsername);

user_router.route('/updateEmail/:userId')
    .patch(verifyToken, userController.updateUserEmail);

user_router.route('/updatePassword/:userId')
    .patch(verifyToken, userController.updateUserPassword);

user_router.route('/updateCampus/:userId')
    .patch(verifyToken, userController.updateUserCampus);

module.exports = user_router;